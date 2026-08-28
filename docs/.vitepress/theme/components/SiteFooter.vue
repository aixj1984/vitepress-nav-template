<script setup lang="ts">
const toolLinks = [
  { text: '世界时间', link: 'https://www.timeanddate.com/' },
  { text: '百度', link: 'https://www.baidu.com/' },
  { text: '网页微信', link: 'https://wx.qq.com/' },
  { text: '本地天气', link: 'https://www.weather.com.cn/' },
  { text: '万年历', link: 'https://www.iamwawa.cn/wannianli.html' },
  { text: '在线翻译', link: 'https://fanyi.baidu.com/' },
  { text: '快递查询', link: 'https://www.kuaidi100.com/' },
  { text: 'IP查询', link: 'https://www.ip138.com/' },
  { text: '网速测试', link: 'https://www.speedtest.cn/' },
  { text: '在线工具', link: 'https://tool.lu/' },
]

const softwareLinks = [
  { text: '微信', link: 'https://www.wechat.com/' },
  { text: 'QQ', link: 'https://im.qq.com/' },
  { text: '钉钉', link: 'https://www.dingtalk.com/' },
  { text: 'DeepSeek', link: 'https://www.deepseek.com/' },
  { text: 'GitHub', link: 'https://github.com/' },
  { text: '火绒', link: 'https://www.huorong.cn/' },
  { text: '高德地图', link: 'https://www.amap.com/' },
  { text: '美团', link: 'https://www.meituan.com/' },
  { text: '饿了么', link: 'https://www.ele.me/' },
  { text: '搜狗拼音', link: 'https://pinyin.sogou.com/' },
]

const gameLinks = [
  { text: '魔兽世界', link: 'https://www.wowchina.com/' },
  { text: '王者荣耀', link: 'https://pvp.qq.com/' },
  { text: '穿越火线', link: 'https://cf.qq.com/' },
  { text: '阴阳师', link: 'https://yys.163.com/' },
  { text: '梦幻西游', link: 'https://xyq.163.com/' },
  { text: 'DNF', link: 'https://dnf.qq.com/' },
  { text: '英雄联盟', link: 'https://lol.qq.com/' },
  { text: '4399小游戏', link: 'https://www.4399.com/' },
  { text: '7k7k', link: 'https://www.7k7k.com/' },
  { text: '17173', link: 'https://www.17173.com/' },
]

const navLinks = [
  { text: '关于我们', link: '#' },
  { text: '广告服务', link: '#' },
  { text: '联系我们', link: '#' },
  { text: '网站提交', link: '#' },
  {
    text: '意见反馈',
    link: 'mailto:80246338@qq.com?subject=%E7%BD%91%E5%9D%80%E4%B9%8B%E5%AE%B6-%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88',
  },
]
</script>

<template>
  <div class="site-bottom">
    <section class="bottom-bars">
      <div class="bottom-row">
        <strong>实用工具：</strong>
        <a
          v-for="item in toolLinks"
          :key="item.text"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
        >
          {{ item.text }}
        </a>
      </div>
      <div class="bottom-row">
        <strong>常用软件：</strong>
        <a
          v-for="item in softwareLinks"
          :key="item.text"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
        >
          {{ item.text }}
        </a>
      </div>
      <div class="bottom-row">
        <strong>游戏专区：</strong>
        <a
          v-for="item in gameLinks"
          :key="item.text"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
        >
          {{ item.text }}
        </a>
      </div>
    </section>

    <footer class="site-footer">
      <p>
        <template v-for="(item, index) in navLinks" :key="item.text">
          <a :href="item.link">{{ item.text }}</a>
          <span v-if="index < navLinks.length - 1" class="sep">|</span>
        </template>
      </p>
      <p class="copy">
        © 2026 网址之家 www.bestsed.com · 广告合作：
        <a
          href="mailto:80246338@qq.com?subject=%E7%BD%91%E5%9D%80%E4%B9%8B%E5%AE%B6-%E5%B9%BF%E5%91%8A%E5%90%88%E4%BD%9C"
        >
          80246338@qq.com
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.site-bottom {
  --sf-primary: #3a7bd5;
  --sf-primary-dark: #2a5fa8;
  --sf-primary-border: #b8d4f0;
  --sf-text: #333;
  --sf-text-muted: #666;
  --sf-white: #fff;
  --sf-radius: 3px;
  --sf-wrap: 1100px;

  width: 100%;
  max-width: var(--sf-wrap);
  margin: 0 auto;
  padding: 0 24px 24px;
  box-sizing: border-box;
}

.bottom-bars {
  margin-top: 10px;
  background: var(--sf-white);
  border: 1px solid var(--sf-primary-border);
  border-radius: var(--sf-radius);
  padding: 8px 14px;
}

.bottom-row {
  font-size: 12px;
  line-height: 2;
  color: var(--sf-text-muted);
}

.bottom-row strong {
  color: var(--sf-primary-dark);
  margin-right: 6px;
}

.bottom-row a {
  margin-right: 10px;
  color: var(--sf-text);
  text-decoration: none;
}

.bottom-row a:hover {
  color: var(--sf-primary);
}

.site-footer {
  margin-top: 16px;
  padding: 16px 0 8px;
  text-align: center;
  font-size: 12px;
  color: var(--sf-text-muted);
  line-height: 1.8;
}

.site-footer a {
  color: var(--sf-text-muted);
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--sf-primary);
}

.site-footer .sep {
  margin: 0 8px;
  color: #ccc;
}

.site-footer .copy {
  margin-top: 6px;
}

:global(.dark) .bottom-bars {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

:global(.dark) .bottom-row,
:global(.dark) .site-footer,
:global(.dark) .site-footer a {
  color: var(--vp-c-text-2);
}

:global(.dark) .bottom-row strong {
  color: var(--vp-c-brand-1);
}

:global(.dark) .bottom-row a {
  color: var(--vp-c-text-1);
}

:global(.dark) .bottom-row a:hover,
:global(.dark) .site-footer a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .site-bottom {
    padding: 0 12px calc(20px + env(safe-area-inset-bottom));
  }

  .bottom-bars {
    margin-top: 8px;
    padding: 10px 12px;
  }

  .bottom-row {
    line-height: 1.9;
    margin-bottom: 6px;
  }

  .bottom-row:last-child {
    margin-bottom: 0;
  }

  .bottom-row a {
    display: inline-block;
    margin-right: 8px;
    padding: 2px 0;
  }

  .site-footer {
    margin-top: 12px;
    padding: 14px 0 0;
  }
}
</style>
