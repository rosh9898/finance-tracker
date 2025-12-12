
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#13151D", // Deep Navy
                surface: "#1F2128",     // Lighter Navy (Cards)
                primary: "#00D09C",     // Neon Green (Income)
                secondary: "#E356FA",   // Neon Purple (Outcome/Accents)
                muted: "#808191",       // Text Muted
                white: "#FFFFFF",
            },
            fontFamily: {
                sans: ["var(--font-poppins)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
