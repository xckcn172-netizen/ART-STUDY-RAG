# 快速开始指南

## 本地运行

### 1. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp ../.env.example .env
# 编辑 .env 文件，填入你的 OPENAI_API_KEY

# 启动后端
uvicorn app.main:app --reload
```

后端将在 http://localhost:8000 运行

### 2. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动前端
npm run dev
```

前端将在 http://localhost:5173 运行

### 3. 访问应用

打开浏览器访问 http://localhost:5173

## Docker运行

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 测试API

### 生成卡片

```bash
curl -X POST http://localhost:8000/api/cards/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "素描中的明暗关系",
    "difficulty": "intermediate",
    "num_questions": 3
  }'
```

### 创建测验

```bash
curl -X POST http://localhost:8000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"num_cards": 5}'
```

## 故障排查

### 后端启动失败

1. 检查Python版本是否为3.11+
2. 确认已安装所有依赖
3. 检查.env文件中的OPENAI_API_KEY

### 前端启动失败

1. 确认Node.js版本是否为18+
2. 删除node_modules重新安装: `rm -rf node_modules && npm install`

### API调用失败

1. 确认后端正在运行
2. 检查CORS配置
3. 查看后端日志

## 获取帮助

- 查看API文档: http://localhost:8000/docs
- 查看部署指南: docs/DEPLOYMENT.md
- 查看评估标准: docs/EVALUATION.md
