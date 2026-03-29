const uiPlugin = require('./plugins/plugin')
const uiTheme = require('./theme/theme')

module.exports = {
  theme: { ...uiTheme },
  plugins: [uiPlugin],
}
