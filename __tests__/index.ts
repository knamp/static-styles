import StaticStyles from '../'

import html from './data/html'
import css from './data/css'

const stylesInUse = StaticStyles(html, css)

console.log(stylesInUse)
