module.exports = {
  content: [
    './polymarket-2.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        pm: {
          navy: '#1B3358',
          'navy-900': '#12233F',
          cream: '#EDE4D2',
          gold: '#A9812F',
          muted: '#6B6154',
          success: '#2F6B4F',
          danger: '#8B3A32'
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'pm-card': '0 8px 22px rgba(27,51,88,0.08)'
      },
      borderRadius: {
        'pm': '0.6rem'
      }
    }
  },
  plugins: []
}
