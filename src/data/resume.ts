export type ResumeLink = {
    label: string
    url: string
}

export type ResumeWork = {
    company: string
    role: string
    period: string
    summary: string
    stack: string[]
    highlights: string[]
    items: ResumeWorkItem[]
}

export type ResumeWorkItem = {
    name: string
    stack: string[]
    description: string
    highlights: string[]
}

export type ResumeProject = {
    name: string
    period: string
    stack: string[]
    description: string
    highlights: string[]
}

export type ResumeEducation = {
    school: string
    degree: string
    major: string
    period: string
    courses: string[]
}

export const resume = {
    basic: {
        name: '刘澈锋',
        gender: '男',
        phone: '19870616536',
        email: '1733869980@qq.com',
        intention: '前端开发工程师',
    },
    skills: [
        '熟悉 HTML/CSS/JavaScript，熟悉 Less 预处理器和 Tailwind CSS 框架',
        '熟悉 React 19，有独立开发项目的能力，能结合 AI 开发项目',
        '熟悉 Vite/Webpack 打包工具，根据项目需求修改配置',
        '熟悉 Node.js 后端开发，掌握 Express/Koa 框架',
        '熟悉 Coze 工作流，LLM 的对话处理',
        '熟悉 Git 的基本命令',
    ],
    links: [
        { label: '力扣', url: 'https://leetcode.cn/u/yun-li-de-yang/' },
        { label: 'Gitee', url: 'https://gitee.com/liu-chefeng' },
        { label: '稀土掘金', url: 'https://juejin.cn/user/3555155234264426/posts' },
    ] satisfies ResumeLink[],
    work: [
        {
            company: '南昌旅梦信息技术有限公司',
            role: '前端开发工程师',
            period: '2025.05 - 2025.10',
            summary: '参与低代码平台与学习平台建设，提升交付效率、体验与稳定性。',
            stack: ['React 19.1.0', 'JavaScript', 'Vite', 'Ant Design', 'React-DnD', 'Tailwind CSS', 'Monaco Editor', 'zustand'],
            highlights: [
                '低代码平台：React DnD 拖拽嵌套、组件树/属性面板、多视图切换与代码生成',
                '学习平台：ECharts 10+ 图表组件支撑学习行为分析与可视化展示',
                '资源上传：分片 + 断点续传，6 路并发与进度反馈，服务端重启后仍可续传',
            ],
            items: [
                {
                    name: '低代码平台',
                    stack: ['React 19.1.0', 'JavaScript', 'Vite', 'Ant Design', 'React-DnD', 'Tailwind CSS', 'Monaco Editor', 'zustand'],
                    description:
                        '现代化低代码可视化编辑平台，聚焦提升 UI 开发效率，支持拖拽组件、实时预览及自动代码生成完成界面设计，适配多角色协作场景。',
                    highlights: [
                        '基于 React DnD 实现跨组件拖拽与嵌套，封装 useMaterialDrop 简化开发，通过事件冒泡实现组件精准选择',
                        '设计遮罩层组件，基于 createPortal 提供 hover/selected 精确高亮蒙层与操作按钮',
                        '采用 JSON 维护组件树结构，实现数据与视图分离，支持设计导出与恢复',
                        '提供编辑/预览双模式，实现组件大纲/源码/物料视图切换，满足不同开发场景',
                        '设计 renderComponents 递归渲染，通过 React.createElement 实现 JSON 到 DOM 的动态转换',
                        '采用 TailwindCSS 原子化样式体系，支持动态注入与响应式设计',
                    ],
                },
                {
                    name: '旅梦学习平台',
                    stack: ['React', 'JavaScript', 'Vite', 'Ant Design', 'ECharts'],
                    description: '为在校学生提供深度学习的平台，包含学习资源获取、学习行为分析与资源上传分享等能力。',
                    highlights: [
                        '基于 ECharts 实现多维度学习数据可视化：折线图、柱状图、热力图等 10+ 图表组件',
                        '主导资源上传模块重构：引入分片 + 断点续传，前端 6 路并发控制与进度反馈',
                        '后端分片元数据管理（记录已传分片索引），支持服务端重启后仍可续传',
                        '支撑日均 5000+ 学习资料上传，用户等待时间减少 45%',
                    ],
                },
            ],
        },
    ] satisfies ResumeWork[],
    projects: [
        {
            name: '在线 AI 阅读平台',
            period: '2025.06 - 2025.08',
            stack: [
                'React 19',
                'TypeScript',
                'Less',
                'Vite',
                'Ant Design',
                'PDF.js',
                'Axios',
                'deepseekApi',
                'Node.js(Koa)',
                'MySQL',
                'JWT',
            ],
            description: 'AI 辅助阅读平台：登录注册、上传/搜索/阅读文本，支持选中文字向 AI 提问。',
            highlights: [
                '将 MySQL 与 IndexedDB 操作封装为独立模块，结合请求/响应拦截器统一处理重复逻辑',
                '对子页面按数据/渲染维度做 lazyload 与缓存，配合防抖/节流控制高频事件',
                '实现大文件切片上传与图片压缩（<10MB 压缩到 <1MB），维护用户文件夹结构 JSON',
                '流式输出 AI 返回内容，长短双 token 无感刷新登录状态；对用户输入做处理降低 SQL 注入风险',
            ],
        },
        {
            name: '健身效果图',
            period: '2025.09',
            stack: ['React 19', 'Coze 工作流', 'CSS', 'JavaScript'],
            description: '上传个人图片与信息，生成健身效果图。',
            highlights: [
                '配置开始节点接收数据，串联代码节点解析参数、模型优化提示、图像理解提取特征，最终调用图像生成输出',
                '熟练调用 Coze 文件上传 API、工作流运行 API，配置 Bearer 鉴权与参数映射',
                '处理 Coze 返回数据，完成上传-调用-展示全流程',
            ],
        },
    ] satisfies ResumeProject[],
    education: {
        school: '东华理工大学',
        degree: '本科',
        major: '软件工程',
        period: '2021 - 2025',
        courses: ['数据结构与算法', '计算机网络', '计算机组成原理', '移动 Web 开发', '移动应用开发', 'Unity3D'],
    } satisfies ResumeEducation,
} as const

export const resumePreview = {
    headline: '前端开发工程师｜React 19｜工程化｜Node.js',
    intro: '关注体验与可维护性，擅长把复杂交互拆解为可复用的组件与工程能力，并结合 AI 提升效率。',
    skillTags: ['React 19', 'JavaScript', 'TypeScript', 'Vite', 'Webpack', 'Less', 'Tailwind CSS', 'Node.js', 'Coze 工作流'],
} as const
