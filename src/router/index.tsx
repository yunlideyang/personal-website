import { useRoutes, BrowserRouter } from "react-router-dom";

import React, { Suspense } from "react";


const Home = React.lazy(() => import("../page/Home/Home.tsx"));
const StartPage = React.lazy(() => import("../page/StartPage/StartPage.tsx"));
const Unfound = React.lazy(() => import("../page/Unfound/Unfound.tsx"));
const BlogPost = React.lazy(() => import("../page/BlogPost/BlogPost.tsx"));
const Project = React.lazy(() => import("../page/Project/Project.tsx"));
const Resume = React.lazy(() => import("../page/Resume/Resume.tsx"));
const ROUTES = [
    {
        path: "/personal-website/start",
        element: <StartPage />
    },
    {
        path: "/personal-website/home",
        element: <Home />
    },
    {
        path: "/personal-website/blog/:articleId",
        element: <BlogPost />
    },
    {
        path: "/personal-website/project/:slug",
        element: <Project />
    },
    {
        path: "/personal-website/resume",
        element: <Resume />
    },
    {
        path: "/personal-website/",
        element: <Unfound />
    },
    {
        path: "/",
        element: <Unfound />
    },
    {
        path: "*",
        element: <Unfound />
    }
]


function WrapperRouters() {
    let router = useRoutes(ROUTES)
    return router
}
export default function wrapperRouters() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--app-page-bg)' }} />}>
                    <WrapperRouters />
                </Suspense>
            </BrowserRouter>
        </>

    )
}
