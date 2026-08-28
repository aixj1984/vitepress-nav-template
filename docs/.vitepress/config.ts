import { basename } from 'node:path'
import { defineConfig } from 'vitepress'

import { head, nav } from './configs'

/** GitHub Pages 项目页用 /仓库名/ ；自定义域名或本地开发用 / */
function resolveBase() {
  const fromEnv = process.env.APP_BASE_PATH
  if (fromEnv) {
    if (fromEnv === '/') return '/'
    return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  }

  const repo = process.env.GITHUB_REPOSITORY
  return repo ? `/${basename(repo)}/` : '/'
}

export default defineConfig({
  outDir: '../dist',
  base: resolveBase(),

  lang: 'zh-CN',
  title: '前端导航',
  description: '基于 VitePress 的个人前端导航',
  head,

  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    i18nRouting: false,

    logo: '/logo.png',
    logoLink: '/',

    nav,
    sidebar: {},

    outline: {
      level: 'deep',
      label: '目录',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/aixj1984/vitepress-nav-template' }],

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    visitor: {
      badgeId: 'aixj1984.vitepress-nav-template',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },
})
