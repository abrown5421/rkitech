/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#06b6d4", 
          "neutral": "#1f2937", 
          "base-100": "#ffffff", 
          "base-200": "#f3f4f6", 
          "base-300": "#e5e7eb",  
          "info": "#0ea5e9",
          "success": "#10b981",  
          "warning": "#f59e0b", 
          "error": "#ef4444", 
          "black": "#000000",
          "white": "#ffffff",
        },
        dark: {
          "primary": "#60a5fa",
          "secondary": "#a78bfa", 
          "accent": "#22d3ee",
          "neutral": "#d1d5db",  
          "base-100": "#1f2937",
          "base-200": "#111827", 
          "base-300": "#030712", 
          "info": "#38bdf8",
          "success": "#34d399",
          "warning": "#fbbf24",  
          "error": "#f87171",
          "black": "#000000",
          "white": "#ffffff",
        },
      },
    ],
  },
}