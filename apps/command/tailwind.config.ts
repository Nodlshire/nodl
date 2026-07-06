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
                wnode: {
                    'border-neutral': 'rgba(255, 255, 255, 0.20)',
                    'border-separator': 'rgba(255, 255, 255, 0.15)',
                    'border-hover': 'rgba(255, 255, 255, 0.40)',
                    'border-accent': 'rgba(255, 255, 255, 0.50)',
                    'compute': '#60a5fa',
                    'identity': '#c084fc',
                    'health': '#4ade80',
                    'warning': '#fbbf24',
                    'sovereign': '#22d3ee',
                },
                background: "var(--nodl-bg)",
                foreground: "var(--nodl-text-primary)",
                nodl: {
                    cyan: "var(--nodl-cyan)",
                    "cyan-dim": "var(--nodl-cyan-dim)",
                    card: "var(--nodl-card-bg)",
                    border: "var(--nodl-border)",
                    "text-secondary": "var(--nodl-text-secondary)",
                },
                cyber: {
                    cyan: "#00f2ff",
                    violet: "#9d00ff",
                    crimson: "#ff0055",
                },
                obsidian: "#050505",
            },
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
                mono: ["Roboto", "monospace"],
            },
            borderRadius: {
                '5px': 'var(--nodl-radius)',
            }
        },
    },
    plugins: [],
};
export default config;
