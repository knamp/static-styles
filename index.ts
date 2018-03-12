import Output from './lib/interfaces/Output'

import StaticStyles from './lib/StaticStyles'

export default (html: string, css: string): Output => {
  return new StaticStyles(html, css).get()
}
