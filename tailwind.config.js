/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#f5f3ef",
        "paper-warm": "#ebe7e0",
        "accent-warm": "#c45c3e",
        "accent-cool": "#2d4a5e",
        muted: "#6b6459",
        divider: "#d4d0c8",
      },
      fontFamily: {
        display: ["Bebas Neue", "Arial Black", "sans-serif"],
        body: ["Libre Baskerville", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
