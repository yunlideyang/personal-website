## 目标
- 把现有 [Home](file:///d:/个人项目/personal-website-frontend/src/page/Home/Home.tsx) 页面原样迁移到 `src/page/StartPage`（作为落地/开场页）。
- 重新实现新的 `Home` 页面，并拆成若干子组件：项目、简历、博客（项目/简历先用假数据；博客先用“可静态展示”的数据，并提供可选的自动抓取方案）。

## 现状确认（我已查到的关键点）
- 路由在 [router/index.tsx](file:///d:/个人项目/personal-website-frontend/src/router/index.tsx) 中：`/personal-website/home` 懒加载指向 `src/page/Home/Home.tsx`。
- 404 页 [Unfound.tsx](file:///d:/个人项目/personal-website-frontend/src/page/Unfound/Unfound.tsx) 会跳回 `/personal-website/home`。
- 现有 Home 调用的 `testApi` 位于根目录 [api/testApi.ts](file:///d:/个人项目/personal-website-frontend/api/testApi.ts)，迁移后相对路径仍可保持 `../../../api/testApi`。

## 实施方案
### 1) 迁移现有 Home → StartPage
- 新建目录 `src/page/StartPage/`。
- 把现有 `src/page/Home/Home.tsx` 复制/迁移为 `src/page/StartPage/StartPage.tsx`。
- 把现有 `src/page/Home/index.module.less` 复制/迁移为 `src/page/StartPage/index.module.less`。
- StartPage 内文案与按钮保持现状（后续可把 “了解更多/联系我” 改为路由跳转到 Home 的具体 section）。

### 2) 新建新的 Home 页面（带子组件）
- 重写 `src/page/Home/Home.tsx` 为一个“内容型主页”，包含：
  - `ProjectsSection`：展示其它项目（卡片/列表，假数据）
  - `ResumeSection`：展示简历摘要（技能、经历、教育、联系方式等，假数据）
  - `BlogSection`：展示掘金文章列表（先静态数据，可点击跳到掘金站）
- 子组件放在 `src/page/Home/components/` 下（例如 `ProjectsSection.tsx`、`ResumeSection.tsx`、`BlogSection.tsx`），样式继续用 `index.module.less` 或各自的 `*.module.less`。

### 3) 博客数据：先可用、再可自动化（两段式）
- **先做可用版本**：在 `src/mock/blog.ts`（或 `src/data/blog.ts`）放一组静态文章信息（标题/时间/标签/跳转链接）。文章标题可直接用你掘金页里能看到的那些。
- **可选增强（我会一并实现，默认不影响运行）**：新增一个 node 脚本（例如 `scripts/sync-juejin-posts.mjs`），通过 `fetch` 拉取 `https://juejin.cn/user/3555155234264426/posts` 的 HTML，然后用轻量正则提取文章标题/链接，生成一个 `src/data/juejinPosts.json`。 
  - 说明：Juejin 页面结构可能会变，此脚本会尽量容错；失败时仍回退到静态假数据，保证线上不挂。

### 4) 调整路由与默认入口
- 在 [router/index.tsx](file:///d:/个人项目/personal-website-frontend/src/router/index.tsx) 增加 StartPage 懒加载并新增路由：
  - `/personal-website/start` → `<StartPage />`
  - `/personal-website/home` → 新的 `<Home />`
- 把 `/personal-website/` 和 `/` 的重定向目标从 `home` 改为 `start`（让 StartPage 成为入口）。
- 同步更新 [Unfound.tsx](file:///d:/个人项目/personal-website-frontend/src/page/Unfound/Unfound.tsx) 的返回地址为 `/personal-website/start`。

### 5) 验证
- 本地运行构建与类型检查，确保路由懒加载路径、CSS module 引用、以及 StartPage 的 `testApi` 调用都正常。
- 手动验证 3 个入口：
  - `/personal-website/start`（开场页）
  - `/personal-website/home`（项目/简历/博客）
  - 任意不存在路径（404 自动跳转回 start）

## 交付结果（你确认后我会产出）
- 新增 `StartPage` 页面并接入路由。
- 新版 `Home` 页面 + 3 个子组件（项目/简历/博客）。
- 项目/简历用假数据；博客先静态可展示，并附带可选同步脚本用于自动抓取更新。

如果你希望默认入口仍然是 `/personal-website/home` 而不是 start，我也可以把第 4 步的重定向保持不变，仅增加 `/start` 作为独立页面。