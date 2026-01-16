import useTheme from '../../theme/useTheme'
import styles from './ThemeToggle.module.less'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const label = theme === 'dark' ? '切换到亮色' : '切换到暗色'
    const icon = theme === 'dark' ? '☾' : '☀'

    return (
        <button
            type="button"
            className={styles.button}
            onClick={toggleTheme}
            aria-label={label}
        >
            <span className={styles.icon} aria-hidden="true">
                {icon}
            </span>
        </button>
    )
}
