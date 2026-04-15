from typing import List, Optional
from .llm_service import LLMService


class RAGService:
    """轻量级RAG服务 - 不依赖向量数据库，使用内置知识库"""

    def __init__(self):
        self.llm_service = LLMService()
        self._knowledge_base = self._get_painting_techniques_knowledge()

    def _get_painting_techniques_knowledge(self) -> str:
        """获取基础绘画技法知识库"""
        return """
# 绘画技法基础知识

## 素描技法
素描是绘画的基础，主要包括以下几个核心技法：

### 明暗关系
- 明暗五调子：亮面、灰面、明暗交界线、反光、投影
- 明暗交界线是物体最暗的部分，也是表现立体感的关键
- 高光是光源直接反射到眼睛的部分，最亮
- 反光是由环境光反射到物体暗部产生的，比中间调稍亮

### 构图原则
- 三分法则：将画面分为九宫格，主体放在交叉点上
- 黄金分割：1:1.618的比例，创造和谐感
- 视觉平衡：通过元素分布实现画面平衡
- 负空间：合理利用空白区域，突出主体

### 透视技法
- 一点透视：只有一个消失点，适合表现正前方场景
- 两点透视：有两个消失点，适合表现建筑和室内
- 三点透视：有三个消失点，适合表现高角度或俯视
- 空气透视：通过色彩和明度变化表现远近关系

## 色彩理论

### 色彩三要素
- 色相：颜色的名称，如红、蓝、黄
- 明度：颜色的明暗程度
- 纯度：颜色的纯净程度，也称饱和度

### 色彩关系
- 对比色：色轮上相对的颜色，如红与绿、蓝与橙
- 类似色：色轮上相邻的颜色，创造和谐感
- 暖色调：红、橙、黄，给人以温暖、活力感
- 冷色调：蓝、紫、绿，给人以宁静、冷静感

## 绘画工具技法

### 铅笔技法
- H铅笔：硬质，适合画细节和亮部
- B铅笔：软质，适合画暗部和大面积
- 排线技巧：通过线条的疏密、方向表现明暗

### 水彩技法
- 湿画法：在湿纸上着色，色彩自然融合
- 干画法：在干纸上叠加色彩，层次分明
- 留白：预先保留白纸，表现高光

### 油画技法
- 肥盖瘦：先画薄层（瘦），后画厚层（肥）
- 湿盖湿：在未干的画布上继续作画
- 透明罩染：透明颜料叠加，创造丰富色彩
"""

    def retrieve_relevant_knowledge(self, query: str, top_k: int = 3) -> List[str]:
        """检索与查询相关的知识（基于关键词匹配）"""
        knowledge = self._knowledge_base
        sections = knowledge.split('\n## ')
        relevant = []

        query_lower = query.lower()
        keywords = set(query_lower.replace('，', ' ').replace('。', ' ').replace('、', ' ').split())

        for section in sections:
            section_lower = section.lower()
            matches = sum(1 for kw in keywords if kw in section_lower)
            if matches > 0:
                relevant.append(section.strip())

        if not relevant:
            relevant = sections[:2]

        return relevant[:top_k]

    async def generate_enhanced_qa(self, topic: str, difficulty: str = "intermediate", num_questions: int = 1):
        """使用RAG生成增强的问答对"""
        relevant_knowledge = self.retrieve_relevant_knowledge(topic, top_k=3)
        return await self.llm_service.generate_qa(topic, difficulty, num_questions)

    def add_document_to_kb(self, content: str, metadata: dict = None):
        """添加文档到知识库"""
        self._knowledge_base += f"\n\n{content}"
