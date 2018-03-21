import * as Css from "css";

import Context from "./interfaces/Context";
import Output from "./interfaces/Output";

import convertToDom from "./convertToDom";
import humanSize from "./humanSize";
import isPseudo from "./isPseudo";

export default class StaticStyles {
  private startTime: [number, number];
  private context: Context;

  constructor(
    private html: string,
    private css: string,
  ) {
    this.startTime = process.hrtime();

    this.context = convertToDom(html);
  }

  public get(): Output {
    const ast = Css.parse(this.css);

    ast.stylesheet.rules = this.filterStyles(ast.stylesheet.rules);

    const compressedCss: string = Css.stringify(ast, {
      compress: true,
    });

    return {
      css: compressedCss,
      stats: {
        efficiency: 1 - (compressedCss.length / this.css.length),
        input: humanSize(this.css.length),
        output: humanSize(compressedCss.length),
        timeSpent: this.getTimeSpend(),
      },
    };
  }

  private filterStyles(rules: any[]): any[] {
    return rules.map((rule) => {

      if (rule.selectors) {
        const matches = rule.selectors.map((selector: string): boolean => {
          const pseudo = isPseudo(selector);
          let matchingElements: NodeList;
          let matchingElementsArray: Node[] = [];

          if (pseudo) {
            const selectorSet = selector.split(":");

            if (selectorSet[0] && selectorSet[0].length > 0) {
              selector = selectorSet[0];
            } else {
              return true;
            }
          }

          try {
            matchingElements = this.context.document.querySelectorAll(selector);
            matchingElementsArray = Array.from(matchingElements);
          } catch (error) {}

          return matchingElementsArray.length > 0;
        });

        if (matches.indexOf(true) === -1) {
          rule.declarations = [];
        }
      } else if (rule.rules) {
        rule.rules = this.filterStyles(rule.rules);
      }

      return rule;
    });
  }

  private getTimeSpend(): [number, number] {
    const currentTime: [number, number] = process.hrtime();

    return [
      currentTime[0] - this.startTime[0],
      (currentTime[1] - this.startTime[1]) / 1000000, // get milli sec
    ];
  }
}
