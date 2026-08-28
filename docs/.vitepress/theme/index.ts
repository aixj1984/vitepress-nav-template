import { h, watch } from 'vue'
import { useData, type EnhanceAppContext } from 'vitepress/client'
import DefaultTheme from 'vitepress/theme'

import MLayout from './components/MLayout.vue'
import MNavLinks from './components/MNavLinks.vue'

import './styles/index.scss'

let homePageStyle: HTMLStyleElement | undefined

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    const { frontmatter } = useData()

    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(MLayout, props)
  },
  enhanceApp({ app, router }: EnhanceAppContext) {
    app.provide('DEV', process.env.NODE_ENV === 'development')
    app.component('MNavLinks', MNavLinks)

    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () =>
          updateHomePageStyle(
            location.pathname === '/' ||
              location.pathname === '/vitepress-nav-template/' ||
              location.pathname.endsWith('/vitepress-nav-template'),
          ),
        { immediate: true },
      )
    }
  },
}

if (typeof window !== 'undefined') {
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome')) {
    document.documentElement.classList.add('browser-chrome')
  } else if (browser.includes('firefox')) {
    document.documentElement.classList.add('browser-firefox')
  } else if (browser.includes('safari')) {
    document.documentElement.classList.add('browser-safari')
  }
}

function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}
