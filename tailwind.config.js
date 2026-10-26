/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        midnight: '#0E0E0E',
        champagne: '#C9A66B',
        'champagne-light': '#DFBE86',
        'antique-gold': '#A8874F',
        'ivory-warm': '#F4EFE5',
        'stone-muted': '#89847C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Bodoni Moda"', 'serif'],
        bodoni: ['"Bodoni Moda"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        'widest-luxury': '0.35em',
        'super-luxury': '0.5em',
        'extreme': '0.7em',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #A8874F 0%, #C9A66B 50%, #F4EFE5 100%)',
        'gold-radial': 'radial-gradient(circle, rgba(201, 166, 107, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
      },
      animation: {
        'pulse-subtle': 'pulseSlow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
