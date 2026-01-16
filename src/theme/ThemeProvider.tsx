import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    return prefersDark ? 'dark' : 'light'
}

export default function ThemeProvider(props: { children: React.ReactNode }) {
    const { children } = props
    const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next)
        localStorage.setItem(STORAGE_KEY, next)
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }, [setTheme, theme])

    useEffect(() => {
        document.documentElement.dataset.theme = theme
    }, [theme])

    const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

