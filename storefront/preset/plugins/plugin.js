const plugin = require('tailwindcss/plugin')
const { darkMode, rootColors } = require('./colors')

const uiPlugin = plugin(function ({ addBase, theme }) {
  addBase({
    '.light': { ...rootColors },
    '.dark': { ...darkMode },
    h1: { fontSize: theme('fontSize.5xl'), fontWeight: theme('fontWeight.normal') },
    h2: { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.normal') },
    h3: { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.normal') },
    h4: { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.normal') },
    h5: { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.normal') },
    h6: { fontSize: '0.875rem', fontWeight: theme('fontWeight.normal') },
  })
})

module.exports = uiPlugin
