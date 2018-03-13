import StaticStyles, { Output } from '../'

import html from './data/html'
import css from './data/css'

const stylesInUse: Output = StaticStyles(html, css)

console.log(stylesInUse)
