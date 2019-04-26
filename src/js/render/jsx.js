/**
 * I was inspired by the following Gist: https://gist.github.com/lygaret/a68220defa69174bdec5 to build this without
 * using React.
 */

import {config} from '../config';

const PARAMETER_REGEX = new RegExp(`${config.jsxPlaceholderPrefix || '__'}(?<index>\\d+)`);

export default function jsx(parts, ...parameters) {
  let htmlString = createHtmlString(parts);

  let parser = new DOMParser();
  let html = parser.parseFromString(htmlString, 'text/html').body.firstChild;

  // console.log(html);

  let dom = createDOM(html);

  return dom;
}

/**
 * Turn the literal parts into a HTML string and replace the parameters with
 * placeholders.
 *
 * @param parts The parts of a tagged literal.
 * @returns {string} A HTML string.
 */
function createHtmlString(parts) {
  let htmlString = '';

  parts.forEach((item, index) => {
    htmlString += item;

    // Put a placeholder instead of the parameter
    if (index !== parts.length - 1) {
      htmlString += `${config.jsxPlaceholderPrefix || '__'}${index}`;
    }
  });

  return htmlString;
}

function createDOM(node) {
  // Text node
  if (node.nodeValue) {
    let value = node.nodeValue;

    if (value.trim().length === 0) {
      return undefined;
    }

    // Normal text without parameters
    if (!PARAMETER_REGEX.test(value)) {
      return document.createTextNode(value);
    }

    return parseParameterized(value);
  }

  // 'Normal' node
  let element = document.createElement(node.localName);

  // Check children
  for (let childNode of node.childNodes) {
    let childElement = createDOM(childNode);

    if (typeof childElement !== 'undefined') {
      if (childElement instanceof Array) {
        childElement.forEach(child => {
          element.append(child);
        });
      } else {
        element.append(childElement);
      }
    }
  }

  return element;
}

function parseParameterized(value) {

  return [];
}
