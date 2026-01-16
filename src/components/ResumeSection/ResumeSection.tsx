import styles from './ResumeSection.module.less'
import { resume, resumePreview } from '../../data/resume'
import { Link } from 'react-router-dom'
import BrandIcon from '../BrandIcons/BrandIcons'
import { detectBrandFromLink } from '../../utils/brandLink'

export default function ResumeSection() {
    const primaryWork = resume.work[0]
    return (
        <section id="resume" className={styles.section}>
            <header className={styles.sectionHeader}>
                <div className={styles.headerRow}>
                    <div>
                        <h2 className={styles.title}>简历</h2>
                        <p className={styles.subtitle}>{resumePreview.headline}</p>
                    </div>
                    <Link className={styles.detailLink} to="/personal-website/resume">查看详细</Link>
                </div>
            </header>

            <div className={styles.grid}>
                <div className={styles.blockWrap}>
                    <div className={styles.block}>
                        <h3 className={styles.blockTitle}>基本信息</h3>
                        <div className={styles.kv}>
                            <div className={styles.kvRow}>
                                <span className={styles.kvKey}>姓名</span>
                                <span className={styles.kvValue}>{resume.basic.name}</span>
                            </div>
                            <div className={styles.kvRow}>
                                <span className={styles.kvKey}>求职意向</span>
                                <span className={styles.kvValue}>{resume.basic.intention}</span>
                            </div>
                            <div className={styles.kvRow}>
                                <span className={styles.kvKey}>联系方式</span>
                                <span className={styles.kvValue}>{resume.basic.phone} / {resume.basic.email}</span>
                            </div>
                        </div>
                        <p className={styles.paragraph}>{resumePreview.intro}</p>
                    </div>
                </div>

                <div className={styles.blockWrap}>
                    <div className={styles.block}>
                        <h3 className={styles.blockTitle}>技能</h3>
                        <div className={styles.tags}>
                            {resumePreview.skillTags.map((s) => (
                                <span key={s} className={styles.tag}>{s}</span>
                            ))}
                        </div>
                        <div className={styles.links}>
                            {resume.links.map((l) => (
                                <a key={l.label} className={styles.link} href={l.url} target="_blank" rel="noreferrer">
                                    {(() => {
                                        const brand = detectBrandFromLink(l)
                                        return brand ? <BrandIcon className={styles.linkIcon} name={brand} /> : null
                                    })()}
                                    <span>{l.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.timeline}>
                <h3 className={styles.blockTitle}>经历</h3>
                <div className={styles.items}>
                    <div className={styles.itemWrap}>
                        <article className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div className={styles.itemTitle}>
                                    <span className={styles.company}>{primaryWork.company}</span>
                                    <span className={styles.role}>{primaryWork.role}</span>
                                </div>
                                <div className={styles.period}>{primaryWork.period}</div>
                            </div>
                            <div className={styles.paragraph}>{primaryWork.summary}</div>
                            <ul className={styles.details}>
                                {primaryWork.highlights.slice(0, 3).map((d) => (
                                    <li key={d} className={styles.detail}>{d}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}
