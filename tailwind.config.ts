import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mario: { sky: "#6B8EFF" },
        zen: {
          wood: "#88B04B",
          stone: "#6B7B8C",
          food: "#F7CAC9",
          stamina: "#B5EAD7",
          border: "#0d0d0d",
          bg: "#E8E4D9",
          bgDark: "#2D2A26",
          brick: "#b85c38",
          brickDark: "#8b4513",
        },
      },
      borderWidth: {
        pixel: "4px",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
