## 你说的“结构有问题”我理解为
- `src/components` 目前混用了两种组织方式：
  - `BlogSection/BlogSection.tsx + BlogSection.module.less`（文件夹式）
  - `ProjectsSection.tsx + ProjectsSection.module.less`（扁平式）
- 你希望我“模仿同目录的 BlogSection”把其它组件也改成文件夹式，从而统一风格。

## 目录结构调整（按 BlogSection 风格统一）
### 1) 目标结构
- `src/components/BlogSection/BlogSection.tsx`（已存在）
- `src/components/BlogSection/BlogSection.module.less`（已存在）
- `src/components/ProjectsSection/ProjectsSection.tsx`（把现有 `ProjectsSection.tsx` 移入）
- `src/components/ProjectsSection/ProjectsSection.module.less`（把现有 `ProjectsSection.module.less` 移入）
- `src/components/ResumeSection/ResumeSection.tsx`（把现有 `ResumeSection.tsx` 移入）
- `src/components/ResumeSection/ResumeSection.module.less`（把现有 `ResumeSection.module.less` 移入）

说明：我会保持和 BlogSection 一样的命名（文件名=组件名），不额外引入新的约定（例如 index.ts barrel），避免“又多一种结构”。

### 2) 引用更新
- 更新 [Home.tsx](file:///d:/个人项目/personal-website-frontend/src/page/Home/Home.tsx) 的 import：
  - `../../components/ProjectsSection` → `../../components/ProjectsSection/ProjectsSection`
  - `../../components/ResumeSection` → `../../components/ResumeSection/ResumeSection`
  - `BlogSection` 保持现状 `../../components/BlogSection/BlogSection`
- 全仓搜索是否还有引用旧路径（如果只有 Home 用到，就只改这里）。

### 3) 清理
- 删除 `src/components` 下旧的扁平文件（ProjectsSection.tsx/.less、ResumeSection.tsx/.less），确保目录内只剩统一结构。

## 给后端 AI 的“抓取掘金文章”上下文（我会整理成一份可直接复制的说明）
我会输出一份面向后端的上下文文档（建议放 `docs/backend-ai-juejin-context.md`），内容包括：

### 1) 前端侧目前的数据契约（后端返回什么就能直接用）
- 前端博客组件期望数据形状（来自 [BlogSection.tsx](file:///d:/个人项目/personal-website-frontend/src/components/BlogSection/BlogSection.tsx)）：
  - `title: string`
  - `publishedText?: string`（可用“YYYY-MM-DD”或“x天前”）
  - `tags?: readonly string[]`
  - `url: string`
- 目前前端静态数据文件：[juejinPosts.ts](file:///d:/个人项目/personal-website-frontend/src/data/juejinPosts.ts)
  - `juejinProfileUrl = https://juejin.cn/user/3555155234264426/posts`
  - 这串 `3555155234264426` 可作为后端请求掘金接口的 `user_id`（同一字段名）。

### 2) 推荐后端抓取方式：调用掘金文章列表接口（比扒 HTML 稳定）
- 接口：`POST https://api.juejin.cn/content_api/v1/article/query_list`（常见做法：通过浏览器 DevTools 也能看到）
- 请求 body 典型字段：`{ "cursor": "0", "sort_type": 2, "user_id": "3555155234264426" }`（示例见资料：[CSDN 示例](https://blog.csdn.net/frontend_frank/article/details/136360333)）
- 返回数据里一般包含文章 id / 标题 / 标签 / 时间戳等；文章链接可以拼为：`https://juejin.cn/post/${article_id}`。
- 工程化建议：
  - 加 UA/Referer/Header；超时与重试；按 cursor 分页；结果缓存（例如 10~30 分钟）；失败降级。

### 3) 兜底方案：抓 profile posts 页 HTML
- 当接口不可用时，后端可以拉取 `https://juejin.cn/user/3555155234264426/posts` HTML 并提取标题/文章链接。
- 但 HTML 更容易被改版影响，建议只作为 fallback。

### 4) 建议给前端提供的后端接口
- `GET /api/blog/juejin/posts?cursor=0&limit=20`
- 返回：`{ list: BlogPost[], nextCursor?: string }`（BlogPost 结构同上）。

（以上内容我会在文档里写得更“能直接交给后端 AI 执行”，包含字段映射、分页策略、缓存与错误处理要点。）

## 验证
- 结构调整后：TypeScript 诊断无报错 + `npm run build` 通过。
- 运行页面确认 Home 能正常渲染三个 section。
