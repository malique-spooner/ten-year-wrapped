import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        panelAlt: "var(--panel-alt)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        accent2: "var(--accent-2)",
        accent3: "var(--accent-3)",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(35, 23, 12, 0.18)",
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at 18% 18%, rgba(203, 95, 47, 0.22), transparent 30%), radial-gradient(circle at 82% 10%, rgba(36, 93, 99, 0.18), transparent 26%), linear-gradient(180deg, #fbf7ef 0%, #f4ede1 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
