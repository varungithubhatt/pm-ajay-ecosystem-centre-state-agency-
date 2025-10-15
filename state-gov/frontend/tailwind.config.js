module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease forwards",
        slideUp: "slideUp 0.6s ease forwards"
      }
    }
  },
  plugins: []
}
