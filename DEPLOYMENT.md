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
├── robots.txt
├── sitemap.xml
├── 50x.html
├── google*.html
└── starhold/
    ├── index.html
    ├── privacy/index.html
    ├── terms/index.html
    ├── _astro/
    └── assets/starhold/
```

- `/`：ZeusAI 公司首页。
- `/starhold/`：Star Hold 游戏首页。
- `/starhold/privacy/`：Star Hold 隐私政策。
- `/starhold/terms/`：Star Hold 服务条款。
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

## 标准网址与搜索索引

全站以 `https://zeusai.ai/` 为主域名。公司首页和 Star Hold 各页面均声明各自的 canonical；`public/sitemap.xml` 只列出四个正式页面，`public/robots.txt` 声明站点地图地址。新增或删除正式页面时，同步维护站点地图；站内的 `#home` 等锚点不作为独立页面列入。

HTML 中的 canonical 不会执行服务器跳转。部署时需要合并以下 Nginx 配置，统一 HTTP、www 和显式 `index.html` 地址。

在现有 HTTP（80 端口）server 中，将两个域名都永久跳转至 HTTPS 主域名：

```nginx
server {
    listen 80;
    server_name zeusai.ai www.zeusai.ai;
    return 301 https://zeusai.ai$request_uri;
}
```

将 HTTPS 的 `www.zeusai.ai` 拆为独立 server；保留现有 TLS 配置，确保证书覆盖 `www.zeusai.ai`：

```nginx
server {
    listen 443 ssl;
    server_name www.zeusai.ai;
    # 此处沿用现有 ssl_certificate、ssl_certificate_key 及其他 TLS 配置。
    return 301 https://zeusai.ai$request_uri;
}
```

在提供网站文件的 HTTPS 主域名 server 中，`server_name` 仅保留 `zeusai.ai`，并在 server 层添加以下规则，合并 `/index.html` 和各子目录的 `/index.html`：

```nginx
if ($request_uri ~ "^([^?]*)/index[.]html(?:[?]|$)") {
    return 301 https://zeusai.ai$1/$is_args$args;
}
```

规则依据原始请求 `$request_uri` 判断，避免 Nginx 为目录请求内部加载 `index.html` 时产生重定向循环；查询参数会保留。以上是需合并的配置示例，并非完整的 TLS 配置文件。如果服务器配置了 ACME HTTP 验证等特殊 location，合并时需保留其处理方式。

检查 `nginx -t` 通过后再重载服务，并验证：

- `https://zeusai.ai/` 返回 200，HTML 包含指向自身的 canonical。
- `http://zeusai.ai/`、`https://www.zeusai.ai/` 和 `https://zeusai.ai/index.html` 最终跳转到 `https://zeusai.ai/`。
- `https://zeusai.ai/starhold/index.html` 跳转到 `https://zeusai.ai/starhold/`。
- `/robots.txt` 和 `/sitemap.xml` 返回 200。

随后在 Google Search Console 提交 `https://zeusai.ai/sitemap.xml`，检查正式网址的索引状态并按需请求编入索引。Google 需要重新抓取后才会更新报告；重复地址无需分别收录。
