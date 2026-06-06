/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B4513",
        secondary: "#D4956A",
        accent: "#C9A96E",
        "accent-light": "#F0D5A0",
        "bg-main": "#FDF6EE",
        "bg-dark": "#2C1A0E",
        "text-dark": "#1A0F00",
        "text-mid": "#5C3D2E",
        "text-light": "#9C7B6B",
        "green-accent": "#6B8F5E",
        "rose-accent": "#C97B84",
        "border-color": "#E8D5C4",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
        sans: ["'Inter'", "'DM Sans'", "sans-serif"],
        accent: ["'Lato'", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(139, 69, 19, 0.10)',
      }
    },
  },
  plugins: [],
}
