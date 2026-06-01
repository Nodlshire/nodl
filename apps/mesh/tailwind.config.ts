import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "../shared/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                emerald: {
                    500: "#10b981",
                },
                gold: {
                    500: "#f59e0b",
                },
                cyber: {
                    cyan: "#00f2ff",
                    violet: "#9d00ff",
                },
                obsidian: "#050505",
            },
            fontFamily: {
                sans: ["var(--font-roboto)"],
                mono: ["var(--font-roboto)"],
            },
        },
    },
    plugins: [],
};
export default config;
