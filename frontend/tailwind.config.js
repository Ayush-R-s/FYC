/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: "var(--accent)",
        border: "var(--border-color)",
        "header-bg": "var(--header-bg)",
        "header-text": "var(--header-text)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
      },
    },
  },
  plugins: [],
};
