module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'node-active': '#10b981',
        'node-failed': '#ef4444',
        'node-warning': '#f59e0b',
        'edge-lora': '#3b82f6',
        'edge-mesh': '#06b6d4',
        'packet': '#22c55e',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.8)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.8)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'packet-float': 'packet-float 2s ease-in-out forwards',
        'dash': 'dash 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'packet-float': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.3)', opacity: '0' },
        },
        'dash': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-20' },
        },
      },
    },
  },
  plugins: [],
}
