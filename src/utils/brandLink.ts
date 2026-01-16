import type { BrandIconName } from '../components/BrandIcons/BrandIcons'

export function detectBrandFromLink(input: { label?: string, url?: string }): BrandIconName | null {
    const label = (input.label || '').toLowerCase()
    const url = (input.url || '').toLowerCase()

    if (label.includes('力扣') || url.includes('leetcode')) return 'leetcode'
    if (label.includes('gitee') || url.includes('gitee.com')) return 'gitee'
    if (label.includes('掘金') || url.includes('juejin.cn')) return 'juejin'
    return null
}

