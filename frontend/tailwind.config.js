/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6366f1', // Indigo-ish purple from your screenshot
          600: '#4f46e5', // Darker indigo
          700: '#4338ca', 
        },
        // Status badge colors
        status: {
          pending: '#f59e0b',    // Amber
          progress: '#3b82f6',   // Blue
          resolved: '#10b981',   // Green
          critical: '#ef4444',   // Red
        }
      }
    },
  },
  plugins: [],
}