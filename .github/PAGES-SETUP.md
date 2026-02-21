# 解决 GitHub Pages 404

**报错：** File not found / 需要 index.html

**原因：** 当前发布源选的是 **main**（源码分支），根目录没有网站文件。

**操作：**

1. 打开：**https://github.com/Clara0619/zen-cabin/settings/pages**
2. 在 **Build and deployment** 里：
   - **Source** 选 **Deploy from a branch**
   - **Branch** 下拉选 **gh-pages**（不要选 main）
   - 右边文件夹选 **/ (root)**
3. 点 **Save**
4. 等 1～2 分钟，再打开：**https://clara0619.github.io/zen-cabin/**

游戏在 gh-pages 分支里，main 只是代码。
