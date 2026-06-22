/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
        // Brand colors for admin
        mahogany: "#6B3A2A",
        terracotta: "#C07850",
        gold: "#D4A96A",
        "gold-light": "#F5E6CC",
        ivory: "#FDF8F0",
        sage: "#7A9E7E",
        rose: "#C48B9F",
        espresso: "#1E1209",
        // Admin dark mode surface colors
        "admin-bg": "#0F0B07",
        "admin-surface": "#1A1410",
        "admin-surface-2": "#241C16",
        "admin-border": "#3D2E22",
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
