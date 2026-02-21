# 部署说明（GitHub Pages）

## 第一步：先选 GitHub Actions（必须）

1. 打开：**https://github.com/Clara0619/zen-cabin/settings/pages**
2. **Build and deployment** 里 **Source** 选 **“GitHub Actions”**（先做这一步，否则 deploy 会失败）。
3. 保存后，到 **Actions** 里找到 “Deploy to GitHub Pages”，点 **Re-run all jobs**。

## 第二步：看游戏

打开：**https://clara0619.github.io/zen-cabin/**

若 Actions 里显示 **build** 失败：看该 job 的红色报错（常见是 npm 或 next build）；已在本仓库关闭 build 时的 ESLint，一般再推一次即可。  
若 **deploy** 失败：多半是没做第一步，去 Settings → Pages 选 GitHub Actions 后再 Re-run。
