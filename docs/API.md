# API 接口文档

## 基础信息

- **Base URL**: `http://localhost:8000` (本地) 或 `https://your-app.up.railway.app` (云端)
- **API Version**: v1
- **Content-Type**: `application/json`

## 认证

当前版本无需认证，所有端点都可以直接访问。

## 通用响应格式

### 成功响应
```json
{
  "data": {...}
}
```

### 错误响应
```json
{
  "detail": "错误信息"
}
```

## 卡片管理 API

### 1. 获取卡片列表

**请求**
```
GET /api/cards
```

**Query参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| difficulty | string | 否 | 筛选难度 (beginner/intermediate/advanced) |
| tag | string | 否 | 筛选标签 |
| limit | integer | 否 | 返回数量限制，默认50 |

**响应示例**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "topic": "素描中的明暗关系",
    "question": "什么是明暗五调子？",
    "answer": "明暗五调子包括亮面、灰面、明暗交界线、反光和投影。这是表现物体立体感和光影效果的基本方法。",
    "difficulty": "intermediate",
    "tags": ["素描", "明暗"],
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

### 2. 获取单个卡片

**请求**
```
GET /api/cards/{card_id}
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| card_id | string | 是 | 卡片ID |

**响应示例**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "topic": "素描中的明暗关系",
  "question": "什么是明暗五调子？",
  "answer": "明暗五调子包括亮面、灰面、明暗交界线、反光和投影。这是表现物体立体感和光影效果的基本方法。",
  "difficulty": "intermediate",
  "tags": ["素描", "明暗"],
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### 3. 创建卡片

**请求**
```
POST /api/cards
```

**请求体**
```json
{
  "topic": "色彩理论中的对比色",
  "question": "什么是对比色？",
  "answer": "对比色是指在色轮上位置相对的颜色，如红色和绿色、蓝色和橙色、黄色和紫色。",
  "difficulty": "intermediate",
  "tags": ["色彩理论", "对比色"]
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | 是 | 绘画主题 |
| question | string | 否 | 问题，不提供则自动生成 |
| answer | string | 否 | 答案，不提供则自动生成 |
| difficulty | string | 否 | 难度，默认intermediate |
| tags | array | 否 | 标签列表 |

**响应示例**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "topic": "色彩理论中的对比色",
  "question": "什么是对比色？",
  "answer": "对比色是指在色轮上位置相对的颜色，如红色和绿色、蓝色和橙色、黄色和紫色。",
  "difficulty": "intermediate",
  "tags": ["色彩理论", "对比色"],
  "created_at": "2024-01-15T11:00:00",
  "updated_at": "2024-01-15T11:00:00"
}
```

### 4. 更新卡片

**请求**
```
PUT /api/cards/{card_id}
```

**请求体**
```json
{
  "question": "对比色的定义是什么？",
  "tags": ["色彩", "对比色", "配色"]
}
```

**字段说明**
所有字段都是可选的，只更新提供的字段。

**响应示例**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "topic": "色彩理论中的对比色",
  "question": "对比色的定义是什么？",
  "answer": "对比色是指在色轮上位置相对的颜色，如红色和绿色、蓝色和橙色、黄色和紫色。",
  "difficulty": "intermediate",
  "tags": ["色彩", "对比色", "配色"],
  "created_at": "2024-01-15T11:00:00",
  "updated_at": "2024-01-15T12:00:00"
}
```

### 5. 删除卡片

**请求**
```
DELETE /api/cards/{card_id}
```

**响应**
HTTP Status: 204 No Content

### 6. AI生成卡片

**请求**
```
POST /api/cards/generate
```

**请求体**
```json
{
  "topic": "水彩技法",
  "difficulty": "intermediate",
  "num_questions": 3
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | 是 | 绘画主题 |
| difficulty | string | 否 | 难度，默认intermediate |
| num_questions | integer | 否 | 生成数量，1-5，默认1 |

**响应示例**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "topic": "水彩技法",
    "question": "什么是水彩的湿画法？",
    "answer": "湿画法是指在湿润的画纸上进行着色，让色彩自然融合流动，创造出柔和的过渡效果。",
    "difficulty": "intermediate",
    "tags": ["水彩技法"],
    "created_at": "2024-01-15T12:30:00",
    "updated_at": "2024-01-15T12:30:00"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "topic": "水彩技法",
    "question": "水彩画中如何实现留白效果？",
    "answer": "留白可以通过预先在需要留白的区域覆盖遮盖胶带，或者在湿润时用干净画笔吸走颜料来实现。",
    "difficulty": "intermediate",
    "tags": ["水彩技法"],
    "created_at": "2024-01-15T12:30:00",
    "updated_at": "2024-01-15T12:30:00"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "topic": "水彩技法",
    "question": "水彩的撒盐技法有什么效果？",
    "answer": "在水彩未干时撒盐，盐粒会吸收水分和颜料，干燥后形成特殊的肌理效果，常用于表现雪花、星空等。",
    "difficulty": "intermediate",
    "tags": ["水彩技法"],
    "created_at": "2024-01-15T12:30:00",
    "updated_at": "2024-01-15T12:30:00"
  }
]
```

## 测验管理 API

### 1. 创建测验

**请求**
```
POST /api/quiz
```

**请求体**
```json
{
  "card_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "num_cards": 5
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| card_ids | array | 否 | 指定卡片ID，不提供则随机选择 |
| num_cards | integer | 否 | 随机选择数量，1-20，默认5 |

**响应示例**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "card_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "answers": [],
  "score": null,
  "started_at": "2024-01-15T13:00:00",
  "completed_at": null
}
```

### 2. 获取测验

**请求**
```
GET /api/quiz/{quiz_id}
```

**响应示例**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "card_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "answers": [
    {
      "card_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_answer": "明暗五调子包括亮面、灰面、明暗交界线、反光和投影",
      "is_correct": true,
      "score": 95.5
    }
  ],
  "score": 85.25,
  "started_at": "2024-01-15T13:00:00",
  "completed_at": "2024-01-15T13:10:00"
}
```

### 3. 提交测验答案

**请求**
```
POST /api/quiz/submit
```

**请求体**
```json
{
  "session_id": "660e8400-e29b-41d4-a716-446655440000",
  "answers": [
    {
      "card_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_answer": "明暗五调子包括亮面、灰面、明暗交界线、反光和投影"
    },
    {
      "card_id": "550e8400-e29b-41d4-a716-446655440001",
      "user_answer": "对比色是指在色轮上位置相对的颜色"
    }
  ]
}
```

**响应示例**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "card_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "answers": [
    {
      "card_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_answer": "明暗五调子包括亮面、灰面、明暗交界线、反光和投影",
      "is_correct": true,
      "score": 95.5
    },
    {
      "card_id": "550e8400-e29b-41d4-a716-446655440001",
      "user_answer": "对比色是指在色轮上位置相对的颜色",
      "is_correct": true,
      "score": 75.0
    }
  ],
  "score": 85.25,
  "started_at": "2024-01-15T13:00:00",
  "completed_at": "2024-01-15T13:10:00"
}
```

### 4. 获取统计信息

**请求**
```
GET /api/quiz/stats/overview
```

**响应示例**
```json
{
  "total_quizzes": 10,
  "average_score": 82.5,
  "total_cards_learned": 25,
  "recent_performance": [85.0, 80.0, 90.0, 78.0, 82.0, 85.0, 88.0, 80.0, 85.0, 82.0]
}
```

### 5. 删除测验

**请求**
```
DELETE /api/quiz/{quiz_id}
```

**响应**
HTTP Status: 204 No Content

## 系统端点

### 健康检查

**请求**
```
GET /health
```

**响应示例**
```json
{
  "status": "healthy"
}
```

### API根端点

**请求**
```
GET /
```

**响应示例**
```json
{
  "message": "Art Study RAG System API",
  "version": "1.0.0",
  "docs": "/docs",
  "api": "/api"
}
```

## 错误码

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 成功，无返回内容 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 交互式文档

访问 `/docs` 可以查看Swagger UI交互式文档。

访问 `/openapi.json` 可以获取OpenAPI规范文档。
