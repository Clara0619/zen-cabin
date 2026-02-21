/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/zen-cabin",
  assetPrefix: "/zen-cabin/",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

module.exports = nextConfig
