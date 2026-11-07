/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: "#9945FF",
          green: "#14F195",
          dark: "#0b0e14",
          card: "#121824",
          border: "#1f293d",
          accent: "#22d3ee"
        }
      },
      backgroundImage: {
        'solana-gradient': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'shield-glow': 'radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.15) 0%, transparent 70%)'
      }
    },
  },
  plugins: [],
};
