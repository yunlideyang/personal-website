import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './index.module.less'
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection'
import ResumeSection from '../../components/ResumeSection/ResumeSection'
import BlogSection, { type BlogPost } from '../../components/BlogSection/BlogSection'
import { juejinPosts, juejinProfileUrl } from '../../data/juejinPosts'
import { getJuejinPosts } from '../../../api/juejinBlogApi'
export default function Home() {
    const [blogPosts, setBlogPosts] = useState<readonly BlogPost[]>(juejinPosts)
    const location = useLocation()

    useEffect(() => {
        const hash = location.hash
        if (!hash) return

        const id = decodeURIComponent(hash.slice(1))
        const el = document.getElementById(id)
        if (!el) return

        requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    }, [location.hash])

    useEffect(() => {
        getJuejinPosts({ cursor: '0', limit: 20 })
            .then((res) => {
                if (Array.isArray(res.list) && res.list.length) {
                    setBlogPosts(res.list)
                }
            })
            .catch(() => {
            })
    }, [])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.brand}>Yunlideyang Home</div>
                    <nav className={styles.nav}>
                        <Link className={styles.navLink} to="/personal-website/home#projects">项目</Link>
                        <Link className={styles.navLink} to="/personal-website/home#resume">简历</Link>
                        <Link className={styles.navLink} to="/personal-website/home#blog">博客</Link>
                    </nav>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.container}>
                    <ProjectsSection />
                    <ResumeSection />
                    <BlogSection posts={blogPosts} profileUrl={juejinProfileUrl} />
                </div>
            </main>
        </div>
    )
}
