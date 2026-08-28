<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { withBase } from 'vitepress/client'
import { NAV_DATA } from '../../../nav/data'
import type { NavLink } from '../types'

type SearchItem = NavLink & { category: string }

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const isMac = ref(false)
const navReady = ref(false)

const allItems = computed<SearchItem[]>(() =>
  NAV_DATA.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      category: group.title,
    })),
  ),
)

function normalize(text: string) {
  return text.toLowerCase().trim()
}

/** 模糊匹配打分：支持名称 / 描述 / URL，包含与子序列匹配 */
function fuzzyScore(text: string, q: string): number {
  if (!text || !q) return 0
  const t = normalize(text)
  const query = normalize(q)

  if (t === query) return 1000
  if (t.startsWith(query)) return 800 - Math.min(t.length, 100)
  const idx = t.indexOf(query)
  if (idx !== -1) return 600 - idx

  let ti = 0
  let score = 0
  let consecutive = 0
  let firstMatch = -1

  for (const char of query) {
    const found = t.indexOf(char, ti)
    if (found === -1) return 0
    if (firstMatch === -1) firstMatch = found
    consecutive = found === ti ? consecutive + 1 : 1
    score += 2 + consecutive * 3
    ti = found + 1
  }

  return score - firstMatch * 0.2 - (t.length - query.length) * 0.05
}

const results = computed(() => {
  const q = query.value.trim()
  if (!q) return []

  return allItems.value
    .map((item) => {
      const titleScore = fuzzyScore(item.title, q) * 3
      const descScore = fuzzyScore(item.desc || '', q) * 1.5
      const linkScore = fuzzyScore(item.link, q) * 2
      const score = Math.max(titleScore, descScore, linkScore)
      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(({ item }) => item)
})

watch(results, () => {
  activeIndex.value = 0
})

watch(open, async (val) => {
  if (val) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
  }
})

function openSearch() {
  open.value = true
}

function closeSearch() {
  open.value = false
}

function resolveIcon(icon: NavLink['icon']) {
  if (!icon || typeof icon !== 'string') return ''
  if (/^https?:\/\//.test(icon)) return icon
  return withBase(icon)
}

function isSvgIcon(icon: NavLink['icon']) {
  return typeof icon === 'object' && !!icon.svg
}

function openItem(item: SearchItem) {
  window.open(item.link, '_blank', 'noopener,noreferrer')
  closeSearch()
}

function onKeydown(e: KeyboardEvent) {
  const isModK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'
  if (isModK) {
    e.preventDefault()
    open.value ? closeSearch() : openSearch()
    return
  }

  if (!open.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    closeSearch()
    return
  }

  if (!results.value.length) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    scrollActiveIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
    scrollActiveIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = results.value[activeIndex.value]
    if (item) openItem(item)
  }
}

async function scrollActiveIntoView() {
  await nextTick()
  const el = listRef.value?.querySelector<HTMLElement>('.is-active')
  el?.scrollIntoView({ block: 'nearest' })
}

onMounted(() => {
  isMac.value = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)
  navReady.value = !!document.querySelector('.VPNavBar')
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})

defineExpose({ openSearch })
</script>

<template>
  <Teleport v-if="navReady" to=".VPNavBar">
    <div class="nav-search-center">
      <button
        class="nav-search-btn"
        type="button"
        aria-label="搜索导航"
        title="搜索导航 (Ctrl/⌘ K)"
        @click="openSearch"
      >
        <span class="nav-search-btn__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
          </svg>
        </span>
        <span class="nav-search-btn__text">搜索网站名称或 URL…</span>
        <kbd class="nav-search-btn__kbd">{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
      </button>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="open" class="nav-search" role="dialog" aria-modal="true" aria-label="搜索导航">
      <div class="nav-search__mask" @click="closeSearch" />
      <div class="nav-search__panel">
        <div class="nav-search__input-wrap">
          <svg
            class="nav-search__input-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            class="nav-search__input"
            type="search"
            placeholder="输入网站名称或 URL 进行搜索…"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="nav-search__esc" type="button" @click="closeSearch">Esc</button>
        </div>

        <div ref="listRef" class="nav-search__list">
          <template v-if="!query.trim()">
            <p class="nav-search__hint">支持模糊匹配名称、描述或网址，回车或点击即可跳转</p>
          </template>
          <template v-else-if="!results.length">
            <p class="nav-search__empty">未找到与「{{ query.trim() }}」相关的站点</p>
          </template>
          <button
            v-for="(item, index) in results"
            :key="`${item.link}-${index}`"
            type="button"
            class="nav-search__item"
            :class="{ 'is-active': index === activeIndex }"
            @mouseenter="activeIndex = index"
            @click="openItem(item)"
          >
            <div class="nav-search__item-icon">
              <span
                v-if="isSvgIcon(item.icon)"
                class="svg"
                v-html="(item.icon as { svg: string }).svg"
              />
              <img
                v-else-if="resolveIcon(item.icon)"
                :src="resolveIcon(item.icon)"
                :alt="item.title"
                loading="lazy"
                referrerpolicy="no-referrer"
                onerror="this.style.display='none'"
              />
              <span v-else class="fallback">{{ item.title.slice(0, 1) }}</span>
            </div>
            <div class="nav-search__item-body">
              <div class="nav-search__item-title">
                <span>{{ item.title }}</span>
                <span class="nav-search__item-cat">{{ item.category }}</span>
              </div>
              <div class="nav-search__item-desc">{{ item.desc || item.link }}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.nav-search-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
  width: min(460px, calc(100vw - 220px));
  pointer-events: auto;
}

.nav-search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 0 12px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.nav-search-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
}

.nav-search-btn__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.nav-search-btn__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.nav-search-btn__kbd {
  display: none;
  flex-shrink: 0;
  padding: 1px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-family: inherit;
  font-size: 11px;
  line-height: 1.4;
  color: var(--vp-c-text-3);
}

@media (min-width: 768px) {
  .nav-search-btn__kbd {
    display: inline-block;
  }
}

@media (max-width: 640px) {
  .nav-search-center {
    width: min(220px, calc(100vw - 140px));
  }

  .nav-search-btn {
    height: 32px;
    padding: 0 10px;
  }

  .nav-search-btn__text {
    font-size: 12px;
  }

  .nav-search-btn__kbd {
    display: none;
  }
}

.nav-search {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 16px 24px;
}

.nav-search__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.nav-search__panel {
  position: relative;
  z-index: 1;
  width: min(640px, 100%);
  max-height: min(70vh, 560px);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-3);
  overflow: hidden;
}

.nav-search__input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nav-search__input-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.nav-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.4;
}

.nav-search__input::placeholder {
  color: var(--vp-c-text-3);
}

.nav-search__esc {
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
}

.nav-search__list {
  overflow: auto;
  padding: 8px;
}

.nav-search__hint,
.nav-search__empty {
  margin: 0;
  padding: 28px 12px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.nav-search__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 0;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
}

.nav-search__item.is-active,
.nav-search__item:hover {
  background: var(--vp-c-bg-soft);
}

.nav-search__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}

.nav-search__item-icon img {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  object-fit: contain;
}

.nav-search__item-icon :deep(svg) {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.nav-search__item-icon .fallback {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.nav-search__item-body {
  min-width: 0;
  flex: 1;
}

.nav-search__item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.nav-search__item-title > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-search__item-cat {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 500;
}

.nav-search__item-desc {
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
