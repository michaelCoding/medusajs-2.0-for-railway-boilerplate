// Note: accordion-slide-down and accordion-slide-up keyframes defined here are
// overridden by the root tailwind.config.js which defines more complete versions
// with opacity transitions. The animation aliases below reference those keyframes.
const animation = {
  'slide-down': 'accordion-slide-down 0.3s ease-in-out',
  'slide-up': 'accordion-slide-up 0.3s ease-in-out',
}
const keyframes = {
  'accordion-slide-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-slide-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
}

module.exports = { animation, keyframes }
