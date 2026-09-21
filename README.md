# ZeusAI Website

`zeusai.ai` 的统一网站项目，包含 ZeusAI 公司首页、Star Hold 游戏首页及隐私政策。所有源码和素材均在本仓库维护，使用 Astro 构建为可由 Nginx 托管的静态网站。

## 开发

需要 Node.js 22.12.0 或更新版本。

```bash
npm ci
npm run dev
```

默认访问地址：

- 公司首页：<http://127.0.0.1:4321/>
- Star Hold：<http://127.0.0.1:4321/starhold/>
- 隐私政策：<http://127.0.0.1:4321/starhold/privacy/>

按 `Ctrl+C` 停止服务。

## 检查、构建和预览

```bash
npm run check
npm run build
npm run preview
```

`npm run build` 输出完整网站到 `dist/`；`npm run preview` 在本地预览该构建结果。上线应部署 `dist/` 的内容，详见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 代码位置

| 内容 | 文件 |
| --- | --- |
| ZeusAI 公司首页 | `src/content/company-home.html`，由 `src/pages/index.astro` 原样渲染 |
| Star Hold 游戏首页 | `src/pages/starhold/index.astro` |
| Star Hold 隐私政策 | `src/pages/starhold/privacy/index.astro` |
| Star Hold 布局与页面元数据 | `src/layouts/BaseLayout.astro` |
| Star Hold 样式 | `src/styles/global.css` |
| Star Hold 路径配置 | `src/config.ts` |
| 图片和视频 | `public/starhold/assets/starhold/` |
| 广告声明、站点验证和错误页 | `public/app-ads.txt`、`public/google*.html`、`public/50x.html` |

`public/` 中的文件原样复制到构建目录。公司首页保留原有 HTML、CSS 和脚本，通过 Astro 首页路由原样输出；Star Hold 使用原项目的页面和样式。修改隐私政策正文时，编辑对应 `.astro` 文件即可。

## 项目来源

Star Hold 源码由 [HiZeusai/starhold_website](https://github.com/HiZeusai/starhold_website) 的提交 `25fd6a3330c61d7095944fc7ae3fd7d57ab334a3` 合并而来，依赖版本沿用原锁文件。合并后可独立安装和构建，不再依赖本机相邻的项目目录。
