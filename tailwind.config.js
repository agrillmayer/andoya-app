/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        andoya: {
          green: "#6cafaf",
          mint: "#e8f4f4",
          violet: "#835baf",
          pink: "#fee4c8",
          cream: "#fff8f2",
          ink: "#35054c",
          slate: "#6c83a4"
        }
      },
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        soft: "0 20px 40px rgba(44, 58, 72, 0.08)"
      }
    }
  },
  plugins: []
};
