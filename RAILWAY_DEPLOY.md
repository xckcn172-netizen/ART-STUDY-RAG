# Railway.app 部署指南

本指南帮助你将美术生RAG复习系统部署到Railway.app，实现公共访问。

## 前提条件

1. [Railway.app账号](https://railway.app)（免费注册）
2. GitHub账号（代码需要托管在GitHub）
3. Groq API Key（用于AI功能）

## 步骤一：准备代码

### 1. 创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 创建新仓库，例如：`art-study-rag-system`
3. 将项目代码推送到仓库：

```bash
# 初始化Git仓库（如果还没有）
cd "/c/Users/22108/art study system"
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Art Study RAG System"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/art-study-rag-system.git

# 推送代码
git push -u origin main
```

### 2. 确保 .gitignore 配置正确

确认 `.gitignore` 文件已配置，不会提交敏感信息：

```bash
# 检查 .gitignore 内容
cat .gitignore
```

## 步骤二：Railway部署

### 方法一：通过Railway CLI（推荐）

1. **安装Railway CLI**
```bash
npm install -g @railway/cli
```

2. **登录Railway**
```bash
railway login
```
浏览器会打开，点击授权。

3. **创建新项目**
```bash
railway init
```
选择项目名称，例如：`art-study-rag`

4. **添加服务**
```bash
railway add
```
选择：
- 项目：`art-study-rag`
- 仓库：你的GitHub仓库
- 分支：`main`

5. **配置环境变量**

```bash
railway variables set GROQ_API_KEY=你的_groq_api_key
railway variables set GROQ_MODEL=llama-3.1-8b-instant
railway variables set LLM_PROVIDER=groq
railway variables set BACKEND_CORS_ORIGINS=*
```

6. **部署**
```bash
railway up
```

7. **获取访问URL**
```bash
railway domain
```

### 方法二：通过Railway Web界面

1. **登录Railway**
   访问 https://railway.app 并登录

2. **创建新项目**
   - 点击 "New Project"
   - 输入项目名称：`art-study-rag`

3. **添加服务**
   - 点击 "Add New Service"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库和分支

4. **配置环境变量**
   - 进入服务 → Settings → Variables
   - 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `GROQ_API_KEY` | `你的_groq_api_key` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` |
| `LLM_PROVIDER` | `groq` |
| `BACKEND_CORS_ORIGINS` | `*` |

5. **配置持久化存储（Volume）**
   - 进入服务 → Settings → Storage
   - 点击 "Add Volume"
   - 路径：`/app/data`

6. **部署服务**
   - 点击 "Deploy Now"

7. **获取访问URL**
   - 部署完成后，服务页面会显示公开URL
   - 格式：`https://your-project-name.up.railway.app`

## 步骤三：验证部署

### 1. 健康检查

```bash
curl https://your-app-name.up.railway.app/health
```

预期响应：
```json
{
  "status": "healthy"
}
```

### 2. 测试API

```bash
# 获取所有卡片
curl https://your-app-name.up.railway.app/api/cards

# 创建测验
curl -X POST https://your-app-name.up.railway.app/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"num_cards": 3}'
```

### 3. 访问API文档

浏览器访问：
```
https://your-app-name.up.railway.app/docs
```

## 步骤四：自定义域名（可选）

### 1. 绑定自定义域名

1. 在Railway服务页面，点击 "Domains"
2. 点击 "Add Domain"
3. 输入你的域名，例如：`study.yourdomain.com`
4. 配置DNS记录：

```
类型: CNAME
名称: study
值: your-app-name.up.railway.app
```

5. Railway会自动配置SSL证书

## 常见问题

### 1. 部署失败

**问题**：构建失败
**解决**：
- 检查Dockerfile.railway是否在根目录
- 检查requirements.txt是否存在
- 查看Railway日志

### 2. API调用失败

**问题**：Groq API错误
**解决**：
- 确认GROQ_API_KEY已正确设置
- 检查Groq账户状态

### 3. 数据丢失

**问题**：重启后数据丢失
**解决**：
- 确保Volume已配置
- Volume路径应该是 `/app/data`

### 4. CORS错误

**问题**：前端无法访问API
**解决**：
- 确保 `BACKEND_CORS_ORIGINS=*`
- 或添加具体的前端域名

## 免费额度

Railway免费版限制：
- **执行时间**：每月500小时
- **内存**：512MB
- **存储**：1GB
- **带宽**：100GB/月

**注意事项**：
- 24小时无流量自动暂停
- 有流量访问时自动恢复
- 超出额度需要升级付费计划

## 监控和维护

### 查看日志

```bash
railway logs
```

或访问Railway Web界面：
- 进入服务 → Logs

### 监控指标

Railway提供：
- CPU使用率
- 内存使用
- 网络流量
- 错误率

## 安全建议

1. **不要提交API Key到Git**
   - 确认 `.gitignore` 包含 `.env`

2. **使用环境变量**
   - 所有敏感信息通过环境变量配置
   - Railway会自动加密存储

3. **定期更新依赖**
   ```bash
   pip list --outdated
   pip install --upgrade package_name
   ```

4. **启用速率限制**（生产环境）
   - 防止API滥用
   - 保护Groq配额

## 下一步

部署完成后，你可以：

1. **分享链接**：将Railway生成的URL分享给其他用户
2. **监控使用**：定期查看Railway指标
3. **优化性能**：根据实际使用情况调整配置
4. **升级计划**：如需更多资源，考虑Railway付费计划

## 故障恢复

### 回滚到之前版本

```bash
railway rollback
```

### 重新部署

```bash
railway up
```

## 参考资源

- [Railway文档](https://docs.railway.app)
- [Railway CLI指南](https://docs.railway.app/develop/cli)
- [Docker最佳实践](https://docs.docker.com/develop/dev-best-practices/)

---

**需要帮助？** 遇到问题随时提问！
