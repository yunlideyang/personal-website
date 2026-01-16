# 掘金博客接口（后端）

用于给前端 `BlogSection` 渲染掘金文章列表，并在站内展示文章正文。

## 列表接口

`GET /api/blog/juejin/posts?cursor=0&limit=20`

### Query 参数

- `cursor`：分页游标（字符串），默认 `0`
- `limit`：本次返回条数，范围 `1~100`，默认 `20`

### 响应

```json
{
  "list": [
    {
      "title": "文章标题",
      "publishedText": "YYYY-MM-DD",
      "tags": ["前端", "JavaScript"],
      "url": "https://juejin.cn/post/{article_id}"
    }
  ],
  "nextCursor": "string"
}
```

字段说明：

- `title`：文章标题
- `publishedText`：由掘金 `ctime/mtime`（秒级时间戳）转换为 `YYYY-MM-DD`
- `tags`：文章标签名数组（若取不到会省略）
- `url`：文章落地页
- `nextCursor`：下一页游标（继续带回接口请求）

### 数据来源与策略

1. **主路径：掘金 API**
   - `POST https://api.juejin.cn/content_api/v1/article/query_list`
   - 使用 `user_id = 3555155234264426` 拉取文章列表
   - 根据返回的 `cursor/has_more` 做按需分页聚合，直到满足 `limit` 或无更多数据
   - 注意：该接口必须用 POST；直接用浏览器 GET 打开通常会返回“请求路由不存在”
2. **缓存（减少频繁调用）**
   - 内存 TTL 缓存：默认 20 分钟
   - Key 维度：`user_id + cursor + limit`
3. **失败降级**
   - 掘金 API 失败：优先返回最近一次成功结果（last-good）
   - 若没有 last-good：拉取 `https://juejin.cn/user/{userId}/posts` HTML 进行兜底解析（尽力提取标题与链接）

## 详情接口（正文）

前端点击某篇文章后可请求此接口获取正文内容，并在站内页面展示。

### 接口

`GET /api/blog/juejin/posts/:articleId`

### Path 参数

- `articleId`：掘金文章 id（列表接口返回的 `url` 中最后一段）

### 响应

```json
{
  "articleId": "7563882393518620724",
  "title": "文章标题",
  "publishedText": "2025-10-22",
  "tags": ["前端", "JavaScript"],
  "url": "https://juejin.cn/post/7563882393518620724",
  "content": "正文内容（Markdown 或 HTML）",
  "contentType": "markdown"
}
```

字段说明：

- `contentType`：`markdown` | `html`
- 优先返回 `markdown`（来自掘金 `mark_content`）；若拿不到 markdown，则返回 `html`

### 安全建议（重要）

- 当 `contentType = "html"` 时，前端渲染必须做 XSS 防护（推荐白名单清洗；或前端仅以纯文本方式展示）。
- 当 `contentType = "markdown"` 时，仍建议前端使用安全的 markdown 渲染策略（禁用危险 HTML/脚本）。

### 数据来源与策略

1. **主路径：掘金详情 API（可能失败）**
   - `POST https://api.juejin.cn/content_api/v1/article/detail`
   - 请求体：`{ "article_id": "{articleId}" }`
   - 已知现象：部分环境仅传 `article_id` 会返回 `err_no=2` “参数错误”
2. **缓存（减少频繁调用）**
   - 内存 TTL 缓存：默认 20 分钟
   - Key 维度：`articleId`
3. **失败降级**
   - 掘金 API 失败：优先返回该文章最近一次成功结果（last-good）
   - 若没有 last-good：拉取 `https://juejin.cn/post/{articleId}` HTML，从页面内提取 `web_html_content` 作为兜底（`contentType: "html"`）

## 配置

配置文件：`config/index.js`

- `port`：服务端口
- `juejinUserId`：掘金用户 id
- `juejinCacheTtlMs`：掘金接口结果缓存时间（毫秒）
- `juejinCacheMaxEntries`：缓存最大条目数
- `juejinRequestTimeoutMs`：请求超时（毫秒）

## 本地验证

### 列表

```bash
curl "http://localhost:3000/api/blog/juejin/posts?cursor=0&limit=5"
```

### 详情

```bash
curl "http://localhost:3000/api/blog/juejin/posts/7563882393518620724"
```

