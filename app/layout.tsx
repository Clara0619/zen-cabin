import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenCabin: Pixel Odyssey",
  description: "像素风治愈系生存建造 · 前额叶训练",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased text-zen-border" style={{ backgroundColor: "#6B8EFF" }}>
        {children}
      </body>
    </html>
  );
}
