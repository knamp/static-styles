/* Some styles are applied only with user interaction, and therefore its
 *   selectors cannot be used with querySelectorAll.
 * http://www.w3.org/TR/2001/CR-css3-selectors-20011113/
 *
 * This is from https://github.com/uncss/uncss/
 */
export default (selector: string): boolean => {
  const ignoredPseudos: string[] = [
    /* link */
    ":link", ":visited",
    /* user action */
    ":hover", ":active", ":focus", ":focus-within",
    /* UI element states */
    ":enabled", ":disabled", ":checked", ":indeterminate",
    /* form validation */
    ":required", ":invalid", ":valid",
    /* pseudo elements */
    "::first-line", "::first-letter", "::selection", "::before", "::after",
    /* pseudo classes */
    ":target",
    /* CSS2 pseudo elements */
    ":before", ":after",
    /* Vendor-specific pseudo-elements:
     * https://developer.mozilla.org/ja/docs/Glossary/Vendor_Prefix
     */
    "::?-(?:moz|ms|webkit|o)-[a-z0-9-]+",
  ];

  // Actual regex is of the format: /^(:hover|:focus|...)$/i
  const pseudosRegex: RegExp = new RegExp("(" + ignoredPseudos.join("|") + ")", "i");
  const matches: RegExpMatchArray | null = selector.match(pseudosRegex);

  return !!(matches && matches.length > 0);
};
