# vitepress-nav-template

<p align="center">基于 <b>VitePress</b> 的个人前端导航站点</p>
<p align="center">
  <a href="/guide.md">使用指引</a> ·
  <a href="https://aixj1984.github.io/vitepress-nav-template/">在线预览</a> ·
  <a href="https://github.com/aixj1984/vitepress-nav-template">GitHub</a>
</p>

---

## 一级访问地址

站点入口为根路径 `/`（不再使用 `/nav/`）：

| 环境         | 地址                                                 |
| ------------ | ---------------------------------------------------- |
| 本地开发     | <http://localhost:8732/>                             |
| GitHub Pages | <https://aixj1984.github.io/vitepress-nav-template/> |

> 旧地址 `/nav/` 会 301 重定向到 `/`。

## 功能

- 导航页直接作为首页
- 顶部居中模糊搜索（支持名称 / URL，`Ctrl/⌘ K`）
- 深浅色主题切换（平滑过渡）
- 自定义页脚链接区
- 访客统计（可选）
- GitHub Pages / Netlify / Vercel 部署

## 本地启动

1. 安装 [Node.js](https://nodejs.org/zh-cn/download)（推荐 20+）
2. `corepack enable`
3. `pnpm install`
4. `pnpm dev`
5. 打开 <http://localhost:8732/>

## 常用修改

| 内容                | 文件                                              |
| ------------------- | ------------------------------------------------- |
| 导航数据            | `docs/nav/data.ts`                                |
| 首页内容            | `docs/index.md`                                   |
| 顶部菜单            | `docs/.vitepress/configs/nav.ts`                  |
| 站点标题 / 社交链接 | `docs/.vitepress/config.ts`                       |
| 页脚                | `docs/.vitepress/theme/components/SiteFooter.vue` |

更细的说明见 [guide.md](./guide.md)。

## 部署

### GitHub Pages（推荐本仓库默认方式）

1. 仓库 **Settings → Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选 `gh-pages`，目录 `/(root)`
4. 推送 `main` 后，Actions 会自动构建并发布
5. 访问：`https://aixj1984.github.io/vitepress-nav-template/`

如使用**自定义域名**，把 `.github/workflows/deploy.yml` 里的 `APP_BASE_PATH` 改成 `/`。

### Netlify / Vercel / Cloudflare Pages

| 项                | 值           |
| ----------------- | ------------ |
| Build command     | `pnpm build` |
| Publish directory | `dist`       |
| Node              | `20+`        |

## 访客统计（可选）

在 `docs/.vitepress/config.ts` 中配置：

```ts
themeConfig: {
  visitor: {
    badgeId: 'aixj1984.vitepress-nav-template',
  },
}
```

## 说明

基于 [maomao1996/vitepress-nav-template](https://github.com/maomao1996/vitepress-nav-template) 改造。  
如有引用、借鉴请保留原作者版权声明。

本仓库：<https://github.com/aixj1984/vitepress-nav-template>
