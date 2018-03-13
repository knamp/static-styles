import * as Css from 'css'

import Context from './interfaces/Context'
import Output from './interfaces/Output'

import isPseudo from './isPseudo'
import convertToDom from './convertToDom'
import humanSize from './humanSize'

export default class StaticStyles {
  private startTime: [number, number]
  private html: string
  private css: string
  private context: Context

  constructor(html: string, css: string) {
    this.startTime = process.hrtime()

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

  private getTimeSpend(): [number, number] {
    const currentTime: [number, number] = process.hrtime()

    return [
      currentTime[0] - this.startTime[0],
      (currentTime[1] - this.startTime[1]) / 1000000 // get milli sec
    ]
  }

  public get(): Output {
    const ast = Css.parse(this.css)

    ast.stylesheet.rules = this.filterStyles(ast.stylesheet.rules)

    const compressedCss: string = Css.stringify(ast, {
      compress: true,
    })

    return {
      stats: {
        efficiency: 1 - (compressedCss.length / this.css.length),
        timeSpent: this.getTimeSpend(),
        input: humanSize(this.css.length),
        output: humanSize(compressedCss.length),
      },
      css: compressedCss,
    }
  }
}
