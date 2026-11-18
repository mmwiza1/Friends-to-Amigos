(function (root) {
  'use strict';
  // Replace an authored whole form, never the same letters inside another word.
  // Equivalent to /(?<![\p{L}\p{N}_])FORM(?![\p{L}\p{N}_])/u without compiling a Unicode-class
  // regex per form, which dominated course start-up time.
  const wordChar = /[\p{L}\p{N}_]/u;
  const before = (text, i) => {
    if (i <= 0) return '';
    const low = text.charCodeAt(i - 1);
    return i >= 2 && low >= 0xdc00 && low <= 0xdfff ? text.slice(i - 2, i) : text[i - 1];
  };
  const after = (text, i) => (i >= text.length ? '' : String.fromCodePoint(text.codePointAt(i)));
  function findToken(text, form) {
    for (let i = text.indexOf(form); i >= 0; i = text.indexOf(form, i + 1)) {
      if (!wordChar.test(before(text, i)) && !wordChar.test(after(text, i + form.length))) return i;
    }
    return -1;
  }
  function replaceForm(sentence, form, replacement) {
    if (typeof sentence !== 'string' || typeof form !== 'string' || !form.trim())
      throw Error('Missing authored Spanish form');
    const index = findToken(sentence, form);
    if (index < 0) throw Error('Authored form not found as a whole token: ' + form);
    return sentence.slice(0, index) + replacement + sentence.slice(index + form.length);
  }
  root.SpanishForms = { replaceForm };
  if (typeof module !== 'undefined') module.exports = root.SpanishForms;
})(typeof window === 'undefined' ? globalThis : window);
