/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#050706',
          deep: '#030504',
          card: '#0A0E0C',
          surface: '#0F1512',
          border: '#18241E',
          divider: '#1E2F26',
        },
        emerald: {
          DEFAULT: '#05D38A',
          bright: '#00F0A0',
          glow: '#10B981',
          accent: '#2EE59D',
          dark: '#064E3B',
          muted: '#13281E',
          surface: '#0B130E',
          border: '#1B3829',
        },
        obsidian: {
          DEFAULT: '#050706',
          deep: '#030504',
        },
        graphite: {
          DEFAULT: '#0A0E0C',
          surface: '#0F1512',
          card: '#141D17',
        },
        chrome: {
          DEFAULT: '#E5E7EB',
          bright: '#FFFFFF',
          metallic: '#D1D5DB',
          dark: '#9CA3AF',
        },
        steel: {
          DEFAULT: '#9CA3AF',
          muted: '#6B7280',
          light: '#D1D5DB',
        },
        gunmetal: {
          DEFAULT: '#18241E',
          light: '#23382D',
          border: '#1A2620',
        },
        ivory: {
          DEFAULT: '#F9FAFB',
          muted: '#E5E7EB',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sora: ['"Sora"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        'widest-luxury': '0.35em',
        'super-luxury': '0.5em',
        'extreme': '0.7em',
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00F0A0 0%, #05D38A 50%, #064E3B 100%)',
        'emerald-radial': 'radial-gradient(circle, rgba(5, 211, 138, 0.15) 0%, rgba(5, 7, 6, 0) 70%)',
        'subtle-grid': 'linear-gradient(to right, rgba(5, 211, 138, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(5, 211, 138, 0.05) 1px, transparent 1px)',
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
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
