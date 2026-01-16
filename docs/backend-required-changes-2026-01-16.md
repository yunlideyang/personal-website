# 后端需修改项（2026-01-16）

本文用于记录：为了支持“站内点击博客 → 请求正文 → 页面展示”，后端还需要补齐/修正的内容，以及我在本机环境的测试结论。

## 测试环境
- 后端基址：`http://localhost:3000`
- 前端会请求：
  - 列表：`GET /api/blog/juejin/posts?cursor=0&limit=20`
  - 详情：`GET /api/blog/juejin/posts/:articleId`

## 已通过（无需修改）
- 列表接口可用：
  - `GET /api/blog/juejin/posts?cursor=0&limit=1`
  - 响应结构包含：`{ list, nextCursor }`
  - `list[0].url` 为 `https://juejin.cn/post/{articleId}`，可用于解析 `articleId`

## 需后端新增（阻塞项）
### 1) 文章详情/正文接口
- 需要新增接口：
  - `GET /api/blog/juejin/posts/:articleId`
- 建议返回（最小可用）：
  ```json
  {
    "articleId": "7563882393518620724",
    "title": "文章标题",
    "publishedText": "2025-10-22",
    "tags": ["前端", "JavaScript"],
    "url": "https://juejin.cn/post/7563882393518620724",
    "content": "正文内容（Markdown 或纯文本）",
    "contentType": "markdown"
  }
  ```
- 当前测试结论：
  - `GET /api/blog/juejin/post/:id`、`GET /api/blog/juejin/article/:id`、`GET /api/blog/juejin/content/:id` 等路径均为 404（Cannot GET ...）
  - 说明后端目前未提供正文/详情接口，前端点击文章后无法展示内容

## 需后端修正/注意（易踩坑）
### 2) 掘金详情“主路径”可能不可直接使用
- 你后端 README 中描述的详情源接口为：
  - `POST https://api.juejin.cn/content_api/v1/article/detail`
  - 请求体：`{ "article_id": "{articleId}" }`
- 我在本机直连测试：仅传 `article_id` 会返回 `err_no=2` 且提示“参数错误”。
- 建议：
  - 将 `https://juejin.cn/post/{articleId}` 的 HTML 解析兜底实现为可用主方案之一（确保接口一定能返回内容）
  - 或者在实现 API 主路径时补齐掘金接口实际需要的额外参数/请求头

### 3) 返回 contentType=html 时的安全边界
- 如果后端返回 `contentType: "html"`：
  - 建议后端进行白名单清洗或输出“可控子集 HTML”
  - 否则前端只能以纯文本方式展示，避免 XSS 风险

## 后端自测命令（建议后端修改后用这些验证）
### 列表
```bash
curl "http://localhost:3000/api/blog/juejin/posts?cursor=0&limit=5"
```

### 详情（需实现）
```bash
curl "http://localhost:3000/api/blog/juejin/posts/7563882393518620724"
```

