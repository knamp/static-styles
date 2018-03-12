import * as Css from 'css'

import Context from './interfaces/Context'
import Output from './interfaces/Output'

import isPseudo from './isPseudo'
import convertToDom from './convertToDom'
import humanSize from './humanSize'

export default class StaticStyles {
  private html: string
  private css: string
  private context: Context

  constructor(html: string, css: string) {
    this.html = html
    this.context = convertToDom(html)
    this.css = css
  }

  private filterStyles(rules: any[]): any[] {
    return rules.map((rule) => {

      if (rule.selectors) {
        const matches = rule.selectors.map((selector: string): boolean => {
          const pseudo = isPseudo(selector)

          if (pseudo) {
            return true
          }

          const matchingElements = this.context.document.querySelectorAll(selector)
          const matchingElementsArray = Array.from(matchingElements)

          return matchingElementsArray.length > 0
        })

        if (matches.indexOf(true) === -1) {
          rule.declarations = []
        }
      }

      return rule
    })
  }

  public get(): Output {
    const ast = Css.parse(this.css)

    ast.stylesheet.rules = this.filterStyles(ast.stylesheet.rules)

    const compressedCss: string = Css.stringify(ast, {
      compress: true,
    })

    return {
      stats: {
        input: humanSize(this.css.length),
        output: humanSize(compressedCss.length),
      },
      css: compressedCss,
    }
  }
}
