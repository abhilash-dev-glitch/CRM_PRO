/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488', // Teal
        secondary: '#0F172A', // Navy
        background: '#F0FDF4', // Mint tint
        card: '#E0F7FA', // Aqua Blue (Light Cyan) for cards
        accent: '#5EEAD4', // Aqua
        text: '#1E293B', // Slate Text

        // Admin theme colors
        'admin-primary': '#0F172A', // Navy
        'admin-sidebar': '#1E293B', // Slate Blue-Grey
        'admin-bg': '#F1F5F9', // Light Neutral Grey
        'admin-card': '#FFFFFF', // White
        'admin-accent': '#0D9488', // Teal (same as user)
        'admin-text': '#0F172A', // Navy
      }
    },
  },
  plugins: [],
}
