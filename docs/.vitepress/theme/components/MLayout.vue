<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide } from 'vue'

import MNavVisitor from './MNavVisitor.vue'
import SiteFooter from './SiteFooter.vue'
import NavSearch from './NavSearch.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

function updateMetaThemeColor() {
  if (inBrowser) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')!
    // #1b1b1f 是 vitepress 在 dark 模式下的背景色
    metaThemeColor.setAttribute('content', isDark.value ? '#1b1b1f' : '#3eaf7c')
  }
}

updateMetaThemeColor()

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  const applyTheme = async () => {
    isDark.value = !isDark.value
    updateMetaThemeColor()
    await nextTick()
  }

  // 无 View Transitions 时用全局颜色过渡，避免生硬闪切
  if (!enableTransitions()) {
    const root = document.documentElement
    root.classList.add('theme-transition')
    await applyTheme()
    window.setTimeout(() => root.classList.remove('theme-transition'), 420)
    return
  }

  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

  // @ts-ignore
  const transition = document.startViewTransition(applyTheme)
  await transition.ready

  const goingDark = isDark.value
  document.documentElement.animate(
    {
      clipPath: goingDark ? [...clipPath].reverse() : clipPath,
    },
    {
      duration: 560,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
      pseudoElement: `::view-transition-${goingDark ? 'old' : 'new'}(root)`,
    },
  )
})
</script>

<template>
  <Layout v-bind="$attrs">
    <!--
      相关插槽
      https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
      https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue
    -->
    <template #nav-bar-title-after>
      <MNavVisitor />
    </template>

    <template #layout-bottom>
      <SiteFooter />
      <NavSearch />
    </template>
  </Layout>
</template>

<style>
.prev-next.prev-next {
  border-top: none;
}
</style>
