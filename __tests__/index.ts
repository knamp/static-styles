import StaticStyles from '../'

import Output from '../lib/interfaces/Output'

import html from './data/html'
import css from './data/css'

const stylesInUse: Output = StaticStyles(html, css)

console.log(stylesInUse)
