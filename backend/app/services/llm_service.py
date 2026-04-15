from typing import List
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from ..core.config import settings
import json


class GeneratedQA(BaseModel):
    question: str = Field(description="生成的问题")
    answer: str = Field(description="对应的答案")


class GeneratedQAs(BaseModel):
    qas: List[GeneratedQA] = Field(description="生成的问答对列表")


class LLMService:
    def __init__(self):
        # Initialize LLM based on provider
        if settings.LLM_PROVIDER.lower() == "groq":
            self.llm = ChatOpenAI(
                model=settings.GROQ_MODEL,
                temperature=0.7,
                api_key=settings.GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1",
            )
        else:  # Default to OpenAI
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL,
                temperature=0.7,
                api_key=settings.OPENAI_API_KEY,
            )

        # Initialize embeddings (still use OpenAI as fallback)
        if settings.OPENAI_API_KEY:
            self.embeddings = OpenAIEmbeddings(
                model=settings.OPENAI_EMBEDDING_MODEL,
                api_key=settings.OPENAI_API_KEY,
            )
        else:
            # Fallback: simple mock embeddings for demo
            self.embeddings = None

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

        parser = PydanticOutputParser(pydantic_object=GeneratedQAs)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """你是一位资深的绘画技法教育专家，专门帮助美术留学生复习绘画知识。

请根据用户提供的主题生成{num_questions}个绘画技法相关的问答对。

要求：
1. 问题应该针对性强，能够测试对{difficulty}绘画技法的理解
2. 答案应该准确、详细，包含必要的绘画术语和理论解释
3. 问题应该具有一定的实用性，能够帮助学生在实际绘画中应用
4. 答案应该用中文回答

请按照以下JSON格式输出：
{format_instructions}"""),
            ("user", "主题：{topic}")
        ])

        chain = prompt | self.llm | parser

        try:
            result = await chain.ainvoke({
                "topic": topic,
                "difficulty": difficulty_cn,
                "num_questions": num_questions,
                "format_instructions": parser.get_format_instructions()
            })
            return result.qas
        except Exception as e:
            # Fallback to simple text parsing if JSON parsing fails
            return await self._generate_qa_fallback(topic, difficulty, num_questions)

    async def _generate_qa_fallback(self, topic: str, difficulty: str, num_questions: int) -> List[GeneratedQA]:
        """
        Fallback method for QA generation
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"请基于主题'{topic}'生成{num_questions}个绘画技法相关的问答对。答案应该详细准确。"),
            ("user", f"主题：{topic}")
        ])

        chain = prompt | self.llm
        result = await chain.ainvoke({})

        # Simple parsing fallback
        lines = result.content.split('\n')
        qas = []
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
                answer=result.content
            ))

        return qas

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        获取文本的向量嵌入
        """
        if self.embeddings:
            return self.embeddings.embed_documents(texts)
        else:
            # Fallback: return simple hash-based embeddings for demo
            import hashlib
            embeddings = []
            for text in texts:
                # Create a simple 384-dim embedding from hash
                hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
                embedding = [(hash_val >> i) & 1 for i in range(384)]
                embeddings.append(embedding)
            return embeddings
