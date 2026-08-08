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
                background: "#000000",
                foreground: "#ffffff",
                surface: "#09090b",
                wnode: {
                    green: "#00FF66",
                    blue: "#0099FF",
                    purple: "#A855F7",
                    gold: "#FFB800",
                    cyan: "#00F0FF"
                }
            }
        },
    },
    plugins: [],
};
export default config;
