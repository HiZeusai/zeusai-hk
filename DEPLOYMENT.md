# 部署说明

## 线上基线与合并

2026-09-21 以 `zeusai.ai` 线上 Nginx 目录 `/usr/share/nginx/html` 为准校对了网站，15 个公开文件通过 SHA-256 校验。

此前公司首页位于 `HiZeusai/zeusai-hk`，Star Hold 来自独立的 `HiZeusai/starhold_website` 项目。主仓库只有旧版隐私政策，未同步新项目的首页、CSS 和素材，导致本地与线上不同。

现在两个项目已整合到当前仓库，统一使用 Astro 开发和构建。Star Hold 来源提交为 `25fd6a3330c61d7095944fc7ae3fd7d57ab334a3`，源码、样式和素材均已纳入当前仓库。

## 构建完整网站

在仓库根目录执行：

```bash
npm ci
npm run check
npm run build
```

完整输出位于 `dist/`：

```text
dist/
├── index.html
├── app-ads.txt
├── 50x.html
├── google*.html
└── starhold/
    ├── index.html
    ├── privacy/index.html
    ├── _astro/
    └── assets/starhold/
```

- `/`：ZeusAI 公司首页。
- `/starhold/`：Star Hold 游戏首页。
- `/starhold/privacy/`：Star Hold 隐私政策。
- 原有域名、页面路径和素材路径保持不变。
- `dist/`、`.astro/` 和 `node_modules/` 为本地生成目录，不提交到 Git。

## 本地检查

开发并自动刷新：

```bash
npm run dev
```

预览已构建的网站：

```bash
npm run preview
```

两者默认均使用 <http://127.0.0.1:4321/>，不要同时占用同一端口；可通过 `-- --port 8000` 指定其他端口。也可在构建后运行：

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

静态服务器必须以 `dist/` 为根目录，不能再直接托管仓库根目录，也不能以 `dist/starhold/` 为根目录。

## 发布到服务器

生产站点使用阿里云服务器的 Nginx，站点根目录为 `/usr/share/nginx/html`。

发布前先备份线上目录，再将 `dist/` 内的完整内容上传到该目录。HTML、`starhold/_astro/` 和素材需要来自同一次构建。服务器上的备份文件不属于发布内容。

推送 GitHub 只更新源码仓库；本仓库未配置自动发布到生产服务器。服务器连接信息单独管理，密码、SSH 私钥和其他凭据不存放在仓库中。
