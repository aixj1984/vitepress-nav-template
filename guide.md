# 使用指引

面向本仓库（导航首页版）的定制说明。

## 一、一级入口

站点主页面就是首页：

- 本地：`http://localhost:8732/`
- 线上：`https://aixj1984.github.io/vitepress-nav-template/`

`/nav/` 仅作兼容跳转，请统一使用根路径。

## 二、首页与导航数据

### 1. 首页

文件：`docs/index.md`

当前为导航布局，一般只需改标题文案：

```md
# 前端导航
```

### 2. 站点列表数据

文件：`docs/nav/data.ts`

| 字段    | 说明                  |
| ------- | --------------------- |
| `icon`  | 图标（绝对/相对路径） |
| `title` | 站点名称              |
| `desc`  | 描述（可选）          |
| `link`  | 跳转链接（必填）      |

```ts
export const NAV_DATA = [
  {
    title: '常用工具',
    items: [
      {
        icon: 'https://example.com/favicon.ico',
        title: '示例站点',
        desc: '一句话介绍',
        link: 'https://example.com',
      },
    ],
  },
]
```

## 三、顶部导航与站点配置

### 1. 顶部菜单

文件：`docs/.vitepress/configs/nav.ts`

```ts
export const nav = [{ text: '前端导航', link: '/' }]
```

### 2. 站点信息

文件：`docs/.vitepress/config.ts`

可改：

- `title` / `description`
- `socialLinks`（GitHub 图标链接）
- `themeConfig.visitor.badgeId`

### 3. 页脚

文件：`docs/.vitepress/theme/components/SiteFooter.vue`

包含底部工具链接与版权信息。

### 4. 搜索

文件：`docs/.vitepress/theme/components/NavSearch.vue`

顶部居中搜索框，支持名称 / URL 模糊匹配；快捷键 `Ctrl/⌘ K`。

## 四、部署注意

GitHub Pages 项目页默认 `base` 为 `/vitepress-nav-template/`。  
自定义域名时，将 workflow 中 `APP_BASE_PATH` 设为 `/`。

## 五、版权

模板源自 [maomao1996/vitepress-nav-template](https://github.com/maomao1996/vitepress-nav-template)。  
引用或二次开发请保留原作者声明。
