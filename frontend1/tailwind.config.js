/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef5ff",
          100: "#d9e8ff",
          500: "#1155cc",
          700: "#07296f",
          800: "#051f58",
          900: "#031746",
          950: "#020d29"
        },
        upchar: {
          green: "#099447",
          greenDark: "#067637",
          blue: "#1358f6",
          red: "#ec1f34",
          orange: "#ff6b1a",
          teal: "#0d9488",
          purple: "#7c3aed"
        }
      },
      boxShadow: {
        soft: "0 18px 55px rgba(3, 23, 70, 0.09)",
        card: "0 12px 28px rgba(3, 23, 70, 0.08)"
      }
    }
  },
  plugins: []
};
