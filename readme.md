# CloudflareWorker-Mirror

功能是从这个项目里独立出的一个路由处理规则: https://www.q58.club/t/topic/165?u=wood

- 反代一切, 接口, 文件等.
- 反代网站不太行, 因为引用的静态资源不会被反代. 
- 防止被盗刷, 就不放演示网站了.

这个项目是一个基于 Cloudflare Workers 的镜像网站工具。它允许用户通过输入原始网站的 URL，来访问该网站的镜像版本。

## 功能

- 处理 OPTIONS 请求（CORS 预检）
- 当请求根路径时，显示引导页面
- 解码并构建实际 URL
- 构建新的请求头
- 创建新的请求并发送
- 构建新的响应头
- 创建新的响应并返回
- 错误处理

## 如何使用

1. 部署 Worker：
  将 worker.js 文件部署到 Cloudflare Workers 中。
2. 访问镜像网站：
  - 打开浏览器，访问你的 Cloudflare Workers 域名。
  - 在引导页面的表单中输入你想要镜像的网站的 URL，然后点击 "访问" 按钮。

## 示例

假设你的 Cloudflare Workers 域名是 https://your-worker-domain.workers.dev ，你想要镜像 https://example.com 网站。

1. 在浏览器中访问 https://your-worker-domain.workers.dev 。
2. 在引导页面的表单中输入 https://example.com ，然后点击 "访问" 按钮。

你将被重定向到 https://your-worker-domain.workers.dev/https://example.com ，这是 https://example.com 的镜像版本。

## 注意事项

- 确保你的 Cloudflare Workers 配置允许跨域请求（CORS）。
- 该工具仅用于合法目的，请勿用于非法或侵犯他人权益的行为。

## 贡献

欢迎提交问题、建议或贡献代码。你可以通过 Issue 或 Pull Request 与我们联系。
