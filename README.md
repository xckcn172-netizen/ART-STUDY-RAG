# 留学美术生RAG复习系统

基于检索增强生成(RAG)技术的美术生复习卡片系统，专注于绘画技法领域。

## 功能特点

- **AI生成复习卡片**：输入绘画主题，自动生成相关问答
- **智能知识检索**：基于向量相似度的相关知识检索
- **自测功能**：卡片式测验，即时反馈
- **学习统计**：追踪学习进度和表现

## 技术栈

### 后端
- **FastAPI**: 现代化的Python Web框架
- **LangChain**: LLM应用开发框架
- **OpenAI GPT-4**: 问答生成
- **ChromaDB**: 向量数据库
- **Pydantic**: 数据验证

### 部署
- **Docker**: 容器化部署
- **Railway.app**: 云端托管

## 快速开始

### 环境要求

- Python 3.11+
- OpenAI API Key

### 本地运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd art-study-rag
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入你的 OPENAI_API_KEY
   ```

3. **安装依赖**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **运行后端**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

5. **访问API文档**
   打开浏览器访问: http://localhost:8000/docs

### 使用Docker

```bash
docker-compose up -d
```

## API端点

### 卡片管理
- `POST /api/cards` - 创建新卡片
- `GET /api/cards` - 获取卡片列表
- `GET /api/cards/{id}` - 获取单个卡片
- `PUT /api/cards/{id}` - 更新卡片
- `DELETE /api/cards/{id}` - 删除卡片
- `POST /api/cards/generate` - AI生成多个卡片

### 测验管理
- `POST /api/quiz` - 创建测验
- `GET /api/quiz/{id}` - 获取测验
- `POST /api/quiz/submit` - 提交答案
- `GET /api/quiz/stats/overview` - 获取统计数据

## 部署指南

详细的部署说明请参考 [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 评估标准

系统评估标准请参考 [docs/EVALUATION.md](docs/EVALUATION.md)

## 项目结构

```
art-study-rag/
├── backend/           # 后端API
│   ├── app/
│   │   ├── api/      # API路由
│   │   ├── core/     # 核心配置
│   │   ├── models/   # 数据模型
│   │   └── services/ # 业务逻辑
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # 前端应用
│   └── src/
├── docs/            # 文档
└── docker-compose.yml
```

## 许可证

MIT License
