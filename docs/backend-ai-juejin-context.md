# 后端 AI 抓取掘金文章上下文

## 背景
- 前端项目：personal-website-frontend（React + TypeScript + Vite）
- 目标：后端提供接口，拉取用户 3555155234264426 的掘金文章列表，返回给前端渲染。

## 前端数据契约
- 前端组件位置：[BlogSection](file:///d:/个人项目/personal-website-frontend/src/components/BlogSection/BlogSection.tsx)
- 组件需要的 `BlogPost` 结构：
  - title: string
  - publishedText?: string（建议为 `YYYY-MM-DD` 或 “x天前”等人类可读）
  - tags?: readonly string[]
  - url: string（文章落地页）
- 静态数据示例与用户主页：
  - 数据示例文件：[juejinPosts.ts](file:///d:/个人项目/personal-website-frontend/src/data/juejinPosts.ts)
  - 用户主页：`https://juejin.cn/user/3555155234264426/posts`
  - user_id：`3555155234264426`（用于接口请求）

## 推荐抓取方案（接口）
- 接口：`POST https://api.juejin.cn/content_api/v1/article/query_list`
- 注意：该接口必须用 POST；如果直接用浏览器 GET 打开，通常会返回“请求路由不存在”之类的错误响应。
- 请求 body 示例：
  ```json
  {
    "cursor": "0",
    "sort_type": 2,
    "user_id": "3555155234264426"
  }
  ```
- 响应中包含文章 id、标题、标签、时间戳等；拼文章链接：`https://juejin.cn/post/${article_id}`
- 分页：使用返回的 `cursor` 继续请求，直到满足数量或无更多数据
- 可靠性建议：
  - 设置 UA/Referer/Content-Type 等请求头
  - 超时与重试策略（指数退避），错误降级（返回最近缓存）
  - 将结果缓存 10~30 分钟，减少频繁调用

## 兜底方案（HTML）
- 当接口不可用或受限时，拉取 `https://juejin.cn/user/3555155234264426/posts` 的 HTML
- 提取标题与文章链接（需要适配 DOM/结构变更），仅作为 fallback

## 建议后端提供的接口
- `GET /api/blog/juejin/posts?cursor=0&limit=20`
- 返回：
  ```json
  {
    "list": [
      {
        "title": "文章标题",
        "publishedText": "2025-12-12",
        "tags": ["前端", "JavaScript"],
        "url": "https://juejin.cn/post/1234567890"
      }
    ],
    "nextCursor": "string"
  }
  ```

## 文章内容接口（当前缺失）
- 前端现在需要：点击某篇文章后，向后端请求“文章详情/正文内容”，并在站内页面展示。
- 建议新增接口（推荐这个命名，避免与列表接口冲突）：
  - `GET /api/blog/juejin/posts/:articleId`
- 建议返回：
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
- 兼容性建议：
  - 若后端更容易拿到 HTML，也可以 `contentType: \"html\"`，但要注意前端渲染时的 XSS 风险（建议后端做白名单清洗或前端仅文本展示）。
- 本地测试结论（当前后端缺失）：`GET /api/blog/juejin/post/:id`、`GET /api/blog/juejin/article/:id` 等路径均返回 404（Cannot GET ...）。

## 掘金详情 API 注意事项
- `POST https://api.juejin.cn/content_api/v1/article/detail` 可能并不能仅凭 `{ "article_id": "xxx" }` 直接拿到详情数据；在我本地直接用该请求体测试会返回 `err_no = 2` 且提示“参数错误”。建议后端把 HTML 兜底作为可用主方案之一，或在实现时补齐掘金所需的额外参数/请求头。

## 字段映射建议
- title ← 接口返回的 `title`
- publishedText ← 接口返回的 `ctime/mtime` 转换为日期或相对时间
- tags ← 接口返回的 `tags` 列表的 `tag_name`（如有）
- url ← 拼接 `https://juejin.cn/post/${article_id}`

## 校验与监控
- 记录请求耗时与错误码
- 捕捉接口返回的 `err_no/err_msg`
- 监控缓存命中率与失败率
