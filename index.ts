import StaticStyles from './lib/StaticStyles'

export default (html: string, css: string): string => {
  return new StaticStyles(html, css).get()
}