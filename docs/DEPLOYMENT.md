# 部署指南

本文档详细说明如何将留学美术生RAG复习系统部署到Railway.app云端。

## 前提条件

- Railway.app账号（免费注册）
- GitHub账号（用于代码推送）
- OpenAI API Key

## Railway.app 部署步骤

### 1. 准备代码

将项目代码推送到GitHub仓库：

```bash
git init
git add .
git commit -m "Initial commit: Art Study RAG System"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Railway部署

#### 方法一：通过Railway CLI（推荐）

1. **安装Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录Railway**
   ```bash
   railway login
   ```

3. **初始化项目**
   ```bash
   railway init
   ```
   按提示选择创建新项目或使用现有项目。

4. **添加服务**
   ```bash
   railway add
   ```
   选择 "Dockerfile" 作为部署方式。

5. **配置环境变量**
   ```bash
   railway variables set OPENAI_API_KEY=your_actual_api_key
   railway variables set OPENAI_MODEL=gpt-4-turbo-preview
   railway variables set CHROMA_PERSIST_DIR=/app/data/chroma
   railway variables set BACKEND_CORS_ORIGINS=*
   ```

6. **添加持久化存储（Volume）**
   ```bash
   railway volume
   ```
   创建一个Volume用于持久化ChromaDB数据。

7. **部署**
   ```bash
   railway up
   ```

8. **获取访问URL**
   ```bash
   railway domain
   ```

#### 方法二：通过Railway Web界面

1. **登录Railway**
   访问 https://railway.app 并登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **配置服务**
   - Railway会自动检测到Dockerfile
   - 确认配置无误

4. **设置环境变量**
   - 进入项目 -> Settings -> Variables
   - 添加以下变量：
     ```
     OPENAI_API_KEY = your_actual_api_key
     OPENAI_MODEL = gpt-4-turbo-preview
     CHROMA_PERSIST_DIR = /app/data/chroma
     BACKEND_CORS_ORIGINS = *
     ```

5. **配置持久化存储**
   - 进入项目 -> Services -> 你的服务
   - 点击 "Storage" -> "Add Volume"
   - 挂载路径: `/app/data`

6. **部署**
   - 点击 "Deploy Now"
   - 等待部署完成

7. **获取访问URL**
   - 部署完成后，点击你的服务
   - 找到 "Domains" 部分
   - 复制生成的URL（格式: `your-app-name.up.railway.app`）

## 验证部署

### 1. 健康检查

访问部署URL的健康检查端点：

```bash
curl https://your-app-name.up.railway.app/health
```

应该返回：
```json
{"status": "healthy"}
```

### 2. API文档测试

访问：
```
https://your-app-name.up.railway.app/docs
```

### 3. 测试API

使用curl测试创建卡片：

```bash
curl -X POST https://your-app-name.up.railway.app/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "素描中的明暗关系",
    "difficulty": "intermediate"
  }'
```

## 免费额度限制

Railway免费版限制：
- **执行时间**: 每月500小时
- **内存**: 512MB
- **存储**: 1GB

**注意事项**:
- 24小时后自动暂停（有流量访问时自动恢复）
- OpenAI API调用会产生费用
- 监控使用量，避免超出额度

## 域名配置（可选）

### 1. 绑定自定义域名

在Railway中：
1. 进入项目 -> Services -> 你的服务
2. 点击 "Domains" -> "Add Domain"
3. 输入你的域名（如 `study.yourdomain.com`）
4. 配置DNS：
   - CNAME记录: `study.yourdomain.com` -> `your-app-name.up.railway.app`

### 2. 启用HTTPS

Railway自动提供SSL证书，无需额外配置。

## 数据持久化

ChromaDB数据存储在Volume中，数据会在以下情况保持：
- 服务重启
- 自动部署
- 手动重新部署

**注意**: 删除服务或Volume会导致数据丢失。

## 监控和日志

### 查看日志

```bash
# CLI方式
railway logs

# Web界面
# 进入项目 -> Services -> 你的服务 -> Logs
```

### 查看指标

在Railway仪表板中可以查看：
- CPU使用率
- 内存使用
- 网络流量
- 错误率

## 故障排查

### 问题1: 部署失败

**原因**: Dockerfile配置错误

**解决**:
```bash
# 本地测试Docker构建
docker build -t art-study-rag ./backend
docker run -p 8000:8000 art-study-rag
```

### 问题2: API调用失败

**原因**: OPENAI_API_KEY未正确设置

**解决**:
```bash
# 检查环境变量
railway variables list

# 重新设置
railway variables set OPENAI_API_KEY=your_key
```

### 问题3: 数据丢失

**原因**: Volume未正确挂载

**解决**:
1. 进入项目 -> Services -> 你的服务
2. 检查 Storage 部分是否有Volume
3. 挂载路径应该是 `/app/data`

### 问题4: 服务自动暂停

**原因**: Railway免费版特性

**解决**:
- 定期访问服务保持活跃
- 或升级到付费计划

## 备份和恢复

### 备份数据

```bash
# 使用Railway CLI备份
railway volume download /app/data backup.tar.gz
```

### 恢复数据

```bash
railway volume upload backup.tar.gz /app/data
```

## 更新部署

推送新代码后自动部署：

```bash
git add .
git commit -m "Update: some changes"
git push
```

Railway会自动检测到更新并重新部署。

## 成本估算

### Railway
- 免费版: $0/月
- 专业版: $5/月起

### OpenAI API
- GPT-4 Turbo: $0.01/1K input tokens, $0.03/1K output tokens
- Embedding: $0.00002/1K tokens

**建议**: 根据使用量选择合适的套餐，监控API调用次数。

## 安全建议

1. **不要提交敏感信息到Git**
   ```bash
   # 添加到.gitignore
   .env
   data/
   ```

2. **使用Railway Secrets**
   不要在代码中硬编码API密钥

3. **启用速率限制**
   在生产环境中考虑添加API速率限制

4. **定期更新依赖**
   ```bash
   pip list --outdated
   pip install --upgrade package_name
   ```

## 进一步配置

- 设置CI/CD pipeline
- 配置错误监控（如Sentry）
- 添加性能监控
- 实现自动备份

## 参考资源

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Guide](https://docs.railway.app/develop/cli)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
