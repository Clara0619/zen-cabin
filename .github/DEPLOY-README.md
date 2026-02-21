# 部署说明（GitHub Pages）

1. 推送代码到 `main` 后，本 workflow 会自动把构建结果推到 **gh-pages** 分支。
2. 在仓库 **Settings → Pages** 里：
   - **Source** 选 **Deploy from a branch**
   - **Branch** 选 **gh-pages**，文件夹选 **/ (root)**，保存。
3. 等 1～2 分钟，访问：**https://clara0619.github.io/zen-cabin/**

若之前选的是 “GitHub Actions”，请改成 “Deploy from a branch” 并选 gh-pages。
