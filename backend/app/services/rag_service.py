from typing import List, Optional
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from ..core.config import settings
from .llm_service import LLMService
import os


class RAGService:
    def __init__(self):
        self.llm_service = LLMService()

        # Use embeddings from LLMService or fallback to OpenAI
        if self.llm_service.embeddings:
            self.embeddings = self.llm_service.embeddings
        elif settings.OPENAI_API_KEY:
            self.embeddings = OpenAIEmbeddings(
                model=settings.OPENAI_EMBEDDING_MODEL,
                api_key=settings.OPENAI_API_KEY,
            )
        else:
            # Create a simple mock embedding function
            self.embeddings = None

        self.persist_dir = settings.CHROMA_PERSIST_DIR
        os.makedirs(self.persist_dir, exist_ok=True)

        # Initialize vector store (skip if no embeddings available)
        if self.embeddings:
            try:
                self.vectorstore = Chroma(
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_dir
                )
            except Exception:
                # If Chroma fails to initialize, create a new one
                self.vectorstore = Chroma(
                    embedding_function=self.embeddings,
                persist_directory=self.persist_dir
            )

        # Knowledge base will be loaded lazily on first use

    def _initialize_knowledge_base(self):
        """
        初始化绘画技法知识库（懒加载，首次调用时执行）
        """
        try:
            # Check if collection exists and has documents
            collections = self.vectorstore._client.list_collections()
            has_data = False
            for collection in collections:
                try:
                    count = self.vectorstore._client.get_collection(collection.name).count()
                    if count > 0:
                        has_data = True
                        break
                except Exception:
                    continue

            if not has_data:
                self._load_basic_knowledge()
        except Exception as e:
            # Silently fail on initialization errors
            print(f"Warning: Could not initialize knowledge base: {e}")

    def _load_basic_knowledge(self):
        """
        加载基础的绘画技法知识
        """
        try:
            basic_knowledge = self._get_painting_techniques_knowledge()

            # Split documents
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50,
                separators=["\n\n", "\n", "。", "；", "，"]
            )

            documents = text_splitter.create_documents([basic_knowledge])

            # Add to vector store
            if documents:
                self.vectorstore.add_documents(documents)
        except Exception as e:
            print(f"Warning: Could not load basic knowledge: {e}")

    def _get_painting_techniques_knowledge(self) -> str:
        """
        获取基础的绘画技法知识
        """
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
色彩理论是理解和使用色彩的基础：

### 色彩三要素
- 色相：颜色的名称，如红、蓝、黄
- 明度：颜色的明暗程度
- 纯度：颜色的纯净程度，也称饱和度

### 色彩关系
- 对比色：色轮上相对的颜色，如红与绿、蓝与橙
- 类似色：色轮上相邻的颜色，创造和谐感
- 暖色调：红、橙、黄，给人以温暖、活力感
- 冷色调：蓝、紫、绿，给人以宁静、冷静感

### 混色技巧
- 减色混合：颜料混合，如红+黄=橙
- 加色混合：光混合，如红+绿=黄
- 色彩温度调整：添加互补色可以降低纯度

## 绘画工具技法

### 铅笔技法
- H铅笔：硬质铅笔，适合画细节和亮部
- B铅笔：软质铅笔，适合画暗部和大面积
- HB铅笔：中等硬度，适合草稿和基础素描
- 排线技巧：通过线条的疏密、方向表现明暗

### 水彩技法
- 湿画法：在湿纸上着色，色彩自然融合
- 干画法：在干纸上叠加色彩，层次分明
- 留白：预先保留白纸，表现高光
- 撒盐：在湿画时撒盐，创造特殊肌理

### 油画技法
- 肥盖瘦：先画薄层（瘦），后画厚层（肥）
- 湿盖湿：在未干的画布上继续作画
- 透明罩染：透明颜料叠加，创造丰富色彩
- 厚涂：直接堆叠颜料，增加肌理感

## 素描与色彩的结合
- 素描是造型基础，先有结构后有色彩
- 色彩依附于形体，遵循光影规律
- 色彩对比需要适度，避免画面杂乱
- 黑白灰关系是色彩画的骨架

## 常见绘画问题解决
1. 画面扁平：加强明暗对比，注意透视关系
2. 色彩脏：控制纯度，避免过多混色
3. 构图空洞：增加主体元素，合理分配空间
4. 立体感弱：强化明暗交界线，注意反光表现
        """

    def retrieve_relevant_knowledge(self, query: str, top_k: int = 3) -> List[str]:
        """
        检索与查询相关的知识
        """
        if not self.embeddings or not hasattr(self, 'vectorstore'):
            return []

        try:
            # Initialize knowledge base on first use
            self._initialize_knowledge_base()
            results = self.vectorstore.similarity_search(query, k=top_k)
            return [doc.page_content for doc in results]
        except Exception as e:
            print(f"Warning: Could not retrieve knowledge: {e}")
            return []

    def generate_enhanced_qa(self, topic: str, difficulty: str = "intermediate", num_questions: int = 1):
        """
        使用RAG生成增强的问答对
        """
        # 先检索相关知识
        relevant_knowledge = self.retrieve_relevant_knowledge(topic, top_k=3)

        # TODO: 可以将检索到的知识传递给LLM生成更准确的QA
        # 目前先使用基础生成方法
        return self.llm_service.generate_qa(topic, difficulty, num_questions)

    def add_document_to_kb(self, content: str, metadata: dict = None):
        """
        添加文档到知识库
        """
        if not self.embeddings or not hasattr(self, 'vectorstore'):
            return

        try:
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50
            )
            documents = text_splitter.create_documents([content], metadatas=[metadata] if metadata else None)
            self.vectorstore.add_documents(documents)
        except Exception as e:
            print(f"Warning: Could not add document to knowledge base: {e}")

