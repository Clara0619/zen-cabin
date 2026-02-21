# 部署到 Vercel（推荐，不用 GitHub Actions）

1. 打开 **https://vercel.com**，用 **GitHub 登录**。
2. 点 **Add New…** → **Project**。
3. 在列表里选 **Clara0619/zen-cabin**，点 **Import**。
4. 在 **Environment Variables** 里点 **Add**：
   - Name: `BASE_PATH`
   - Value: 留空（不填）
   - 勾选 Production / Preview / Development，点 **Add**。
5. 点 **Deploy**，等 1～2 分钟。
6. 部署完成后会给你一个地址，例如：**https://zen-cabin-xxx.vercel.app**，点开就能玩。

以后每次推送到 GitHub，Vercel 会自动重新部署，网址不变。
