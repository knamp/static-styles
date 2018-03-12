import { JSDOM } from 'jsdom'

import IDocument from './IDocument'

const convertToDom = (html: string): IDocument => {
  if (!html || html.length === 0) {
    throw new Error('HTML not set')
  }

  let jsdom: JSDOM = new JSDOM(html)

  return {
    jsdom,
    window: jsdom.window,
    document: jsdom.window.document
  }
}

export default convertToDom
