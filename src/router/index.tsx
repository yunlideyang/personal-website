import { useRoutes, BrowserRouter } from "react-router-dom";

import React from "react";


const Home = React.lazy(() => import("../page/Home/Home.tsx"));
const Unfound = React.lazy(() => import("../page/Unfound/Unfound.tsx"));
const ROUTES = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/personal-website/home",
        element: <Home />
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
                <WrapperRouters />
            </BrowserRouter>
        </>

    )
}
