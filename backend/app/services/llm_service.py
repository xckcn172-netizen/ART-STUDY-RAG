from typing import List, Optional
from pydantic import BaseModel, Field
from ..core.config import settings
import json
import httpx


class GeneratedQA(BaseModel):
    question: str = Field(description="生成的问题")
    answer: str = Field(description="对应的答案")


class GeneratedQAs(BaseModel):
    qas: List[GeneratedQA] = Field(description="生成的问答对列表")


class LLMService:
    def __init__(self):
        if settings.LLM_PROVIDER.lower() == "groq":
            self.api_key = settings.GROQ_API_KEY
            self.model = settings.GROQ_MODEL
            self.base_url = "https://api.groq.com/openai/v1"
        else:
            self.api_key = settings.OPENAI_API_KEY
            self.model = settings.OPENAI_MODEL
            self.base_url = "https://api.openai.com/v1"

    async def _call_api(self, messages: list) -> str:
        """调用OpenAI兼容API"""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def generate_qa(self, topic: str, difficulty: str = "intermediate", num_questions: int = 1) -> List[GeneratedQA]:
        """
        基于输入主题生成问答对
        """
        difficulty_map = {
            "beginner": "基础",
            "intermediate": "中级",
            "advanced": "高级",
        }
        difficulty_cn = difficulty_map.get(difficulty, "中级")

        system_prompt = f"""你是一位资深的绘画技法教育专家，专门帮助美术留学生复习绘画知识。

请根据用户提供的主题生成{num_questions}个绘画技法相关的问答对。

要求：
1. 问题应该针对性强，能够测试对{difficulty_cn}绘画技法的理解
2. 答案应该准确、详细，包含必要的绘画术语和理论解释
3. 问题应该具有一定的实用性，能够帮助学生在实际绘画中应用
4. 答案应该用中文回答

请严格按照以下JSON格式输出，不要输出其他内容：
{{"qas": [{{"question": "问题内容", "answer": "答案内容"}}]}}"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"主题：{topic}"}
        ]

        try:
            result_text = await self._call_api(messages)
            # 尝试解析JSON
            result_text = result_text.strip()
            # 去掉可能的markdown代码块标记
            if result_text.startswith("```"):
                result_text = result_text.split("\n", 1)[1] if "\n" in result_text else result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            result_text = result_text.strip()
            if result_text.startswith("json"):
                result_text = result_text[4:].strip()

            data = json.loads(result_text)
            qas = []
            for qa in data.get("qas", []):
                qas.append(GeneratedQA(question=qa["question"], answer=qa["answer"]))
            return qas if qas else await self._generate_qa_fallback(topic, difficulty, num_questions)
        except Exception as e:
            return await self._generate_qa_fallback(topic, difficulty, num_questions)

    async def _generate_qa_fallback(self, topic: str, difficulty: str, num_questions: int) -> List[GeneratedQA]:
        """
        Fallback method for QA generation
        """
        messages = [
            {"role": "system", "content": f"请基于主题生成{num_questions}个绘画技法问答对，用中文回答。"},
            {"role": "user", "content": f"主题：{topic}"}
        ]

        result_text = await self._call_api(messages)
        qas = []
        lines = result_text.split('\n')
        current_q = None
        current_a = []

        for line in lines:
            line = line.strip()
            if line.startswith(('问题', '问:', 'Q:', 'Question')):
                if current_q and current_a:
                    qas.append(GeneratedQA(question=current_q, answer=''.join(current_a)))
                current_q = line
                current_a = []
            elif line.startswith(('答案', '答:', 'A:', 'Answer')) and current_q:
                current_a.append(line)
            elif current_a:
                current_a.append(line)

        if current_q and current_a:
            qas.append(GeneratedQA(question=current_q, answer=''.join(current_a)))

        if not qas:
            qas.append(GeneratedQA(
                question=f"关于{topic}的核心知识点是什么？",
                answer=result_text
            ))

        return qas
