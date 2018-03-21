import { JSDOM } from "jsdom";

import Context from "./interfaces/Context";

const convertToDom = (html: string): Context => {
  if (!html || html.length === 0) {
    throw new Error("HTML not set");
  }

  const jsdom: JSDOM = new JSDOM(html);

  return {
    document: jsdom.window.document,
    jsdom,
    window: jsdom.window,
  };
};

export default convertToDom;
