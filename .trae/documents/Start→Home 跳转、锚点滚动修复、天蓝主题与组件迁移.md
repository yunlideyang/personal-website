## 目标
- Start 页面点击「了解更多」直接进入 Home（可带 hash 定位到某个 section）。
- 修复 Home 顶部菜单点击后不滚动、反而跳到 start 的问题。
- 将主题主色调改为天蓝色（Start + Home + 相关按钮/链接的强调色）。
- 将 `src/page/Home/components` 迁移到 `src/components`，并更新引用。

## 问题定位（已确认）
- 你的 `index.html` 设置了 `<base href="/personal-website/">`，因此 `href="#projects"` 这类“纯 hash 相对链接”会解析成 `/personal-website/#projects`，而不是当前页面 `/personal-website/home#projects`。
- 路由里 `/personal-website/` 会重定向到 `/personal-website/start`，所以点击菜单后会“跳回 start”。

## 实施步骤
### 1) StartPage「了解更多」跳转到 Home
- 修改 [StartPage.tsx](file:///d:/个人项目/personal-website-frontend/src/page/StartPage/StartPage.tsx) ：
  - 用 `react-router-dom` 的 `Link`（或 `useNavigate`）替换当前的 `<a href="#about">`。
  - `了解更多` → `to="/personal-website/home"`（或 `to="/personal-website/home#projects"` 让它进入后直接滚到项目区）。
  - 同步处理 `联系我`：避免再用 `#contact` 这种相对 hash（可改为 `/personal-website/home#blog` 或保留为外链/后续再做 Contact section）。

### 2) Home 菜单锚点滚动修复（不再回 start）
- 修改 [Home.tsx](file:///d:/个人项目/personal-website-frontend/src/page/Home/Home.tsx) ：
  - 把 `href="#projects"` 改为 `Link to="/personal-website/home#projects"`（resume/blog 同理），确保解析路径包含 `/home`。
- 增强 hash 滚动体验：
  - 在 Home 内增加 `useLocation` + `useEffect`，当进入 `/home#xxx` 或 hash 变化时，执行 `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`。
  - 为避免 sticky header 遮挡，在三个 section 的 `.section` 样式上加 `scroll-margin-top`（例如 84px）。

### 3) 天蓝色主题改造
- 修改 Start 与 Home 的背景渐变：
  - [StartPage/index.module.less](file:///d:/个人项目/personal-website-frontend/src/page/StartPage/index.module.less) 把紫色渐变替换为天蓝/浅青系。
  - [Home/index.module.less](file:///d:/个人项目/personal-website-frontend/src/page/Home/index.module.less) 两个 radial 的强调色替换为天蓝系。
- 调整卡片/按钮强调色：
  - [ProjectsSection.module.less](file:///d:/个人项目/personal-website-frontend/src/page/Home/components/ProjectsSection.module.less) `.link` 的背景/边框从紫色改为天蓝。
  - [BlogSection.module.less](file:///d:/个人项目/personal-website-frontend/src/page/Home/components/BlogSection.module.less) `.profileLink` 的背景/边框从紫色改为天蓝。

### 4) 迁移 Home/components → src/components
- 新建并移动文件到 `src/components`：
  - `ProjectsSection.tsx/.module.less`
  - `ResumeSection.tsx/.module.less`
  - `BlogSection.tsx/.module.less`
- 更新 [Home.tsx](file:///d:/个人项目/personal-website-frontend/src/page/Home/Home.tsx) 的 import 路径指向 `src/components/*`。
- 删除原目录 `src/page/Home/components`。

## 验证方式
- 本地启动后验证：
  - Start 点击「了解更多」→ 正确进入 `/personal-website/home`（或带 hash）。
  - Home 顶部菜单点击「项目/简历/博客」→ URL 变为 `/personal-website/home#...` 且页面平滑滚到对应 section，不再跳 start。
  - 直接访问 `/personal-website/home#blog` → 进入后自动滚动到博客区。
  - 主题色视觉确认（背景与按钮强调色为天蓝）。
  - `npm run build` 通过，确保迁移后 TS/CSS modules 引用无误。
