/** @type {import('next').NextConfig} */
const base = process.env.BASE_PATH ?? "/zen-cabin";
const nextConfig = {
  output: "export",
  basePath: base,
  assetPrefix: base === "" ? "" : base + "/",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

module.exports = nextConfig;
