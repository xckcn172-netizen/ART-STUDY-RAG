# Vercel部署指南

本指南帮助您将美术生RAG复习系统部署到Vercel，实现公网访问。

## 前提条件

1. [Vercel账号](https://vercel.com/signup)（使用GitHub登录）
2. [Groq API Key](https://console.groq.com/)（用于AI功能）
3. GitHub仓库已推送到：`https://github.com/xckcn172-netizen/ART-STUDY-RAG`

## 部署步骤

### 第1步：登录Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"
4. 授权Vercel访问您的GitHub账号

### 第2步：导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 部分，找到并点击 **ART-STUDY-RAG**
3. 点击 **"Import"**

### 第3步：配置项目

#### 环境变量配置

在 "Environment Variables" 部分，添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `GROQ_API_KEY` | `您的Groq API密钥` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` |
| `LLM_PROVIDER` | `groq` |

**注意**：Groq API Key获取步骤：
1. 访问 https://console.groq.com/
2. 登录后点击左侧 "API Keys"
3. 点击 "Create API Key"
4. 复制生成的密钥

#### 构建设置（保持默认即可）

```
Framework Preset: Vite
Root Directory: ./frontend
Build Command: npm run build
Output Directory: dist
```

### 第4步：部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（约2-3分钟）
3. 部署成功后会显示一个URL，如：
   ```
   https://art-study-rag.vercel.app
   ```

### 第5步：验证部署

部署完成后，访问：

- **主页面**：`https://your-project-name.vercel.app`
- **API健康检查**：`https://your-project-name.vercel.app/api/health`
- **API文档**：`https://your-project-name.vercel.app/api/docs`

## 本地测试

在部署前，您可以在本地测试Vercel配置：

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 本地预览
vercel dev

# 部署到预览环境
vercel
```

## 自定义域名（可选）

### 1. 添加自定义域名

1. 在Vercel项目页面，点击 **"Settings"** → **"Domains"**
2. 输入您的域名，例如：`art-study.yourdomain.com`
3. 点击 **"Add"**

### 2. 配置DNS

在您的域名DNS设置中添加：

```
类型: CNAME
名称: art-study
值: cname.vercel-dns.com
```

Vercel会自动配置SSL证书。

## 免费额度

Vercel免费版限制：
- **带宽**：100GB/月
- **执行时间**：6000小时/月
- **构建**：6000分钟/月
- **Serverless Functions**：无限制（但在免费额度内）

**注意事项**：
- 免费版适合个人项目
- 有流量限制，超出需升级
- 自动HTTPS证书
- 全球CDN加速

## 常见问题

### 1. 部署失败

**问题**：构建失败

**解决**：
- 检查 `vercel.json` 配置是否正确
- 查看Vercel构建日志
- 确保所有依赖都在 `requirements.txt` 中

### 2. API调用失败

**问题**：前端无法调用后端API

**解决**：
- 检查环境变量 `GROQ_API_KEY` 是否正确设置
- 确认CORS配置允许前端域名
- 检查 `/api/health` 端点是否正常

### 3. 数据丢失

**问题**：重新部署后数据丢失

**说明**：
- Vercel Serverless Functions是无状态的
- 每次请求都是独立的
- 建议使用外部数据库（如Railway PostgreSQL）

### 4. 超时错误

**问题**：API调用超时

**解决**：
- Vercel Serverless Functions有10秒超时限制
- 优化API响应时间
- 考虑使用队列处理长时间任务

## 监控和维护

### 查看日志

1. 进入项目 → **"Deployments"**
2. 点击具体的部署记录
3. 查看 "Function Logs"

### 性能监控

Vercel提供：
- 响应时间
- 错误率
- 流量统计
- Web Vitals指标

### 重新部署

代码更新后，Vercel会自动部署。也可以手动触发：
1. 进入项目 → **"Deployments"**
2. 点击 **"Redeploy"**

## 安全建议

1. **不要提交API Key到Git**
   - 确认 `.gitignore` 包含 `.env`
   - 使用Vercel环境变量存储敏感信息

2. **启用速率限制**
   - 防止API滥用
   - 保护Groq配额

3. **定期更新依赖**
   ```bash
   pip list --outdated
   npm outdated
   ```

## 下一步

部署完成后，您可以：

1. **分享链接**：将Vercel生成的URL分享给其他用户
2. **监控性能**：查看Vercel Analytics
3. **优化配置**：根据实际使用情况调整
4. **升级计划**：如需更多资源，考虑Vercel付费计划

## 参考资源

- [Vercel文档](https://vercel.com/docs)
- [Vercel Python运行时](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)
- [Vercel环境变量](https://vercel.com/docs/projects/environment-variables)

---

**需要帮助？** 遇到问题随时提问！
