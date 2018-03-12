import * as Css from 'css'
import isPseudo from './isPseudo'
import convertToDom from './convertToDom'
import IDocument from './IDocument'
import humanSize from './humanSize'
import IOutput from './IOutput'

export default class StaticStyles {
  private html: string
  private css: string
  private context: IDocument

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

  get(): IOutput {
    const ast = Css.parse(this.css)

    ast.stylesheet.rules = this.filterStyles(ast.stylesheet.rules)

    const compressedCss = Css.stringify(ast, {
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
