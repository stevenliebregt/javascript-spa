/**
 * I was inspired by the following Gist: https://gist.github.com/lygaret/a68220defa69174bdec5 to build this without
 * using React.
 */

import {config} from '../config';

const PARAMETER_REGEX = new RegExp(`${config.jsxPlaceholderPrefix || '__'}(?<index>\\d+)`);

export default function jsx(parts, ...parameters) {
  let htmlString = createHtmlString(parts);

  let parser = new DOMParser();
  let html = parser.parseFromString(htmlString, 'text/xml');

  return processParameters(html.firstChild, parameters);
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

function processParameters(node, parameters)
{
  // Check if it is a text node.
  if (node.nodeValue) {
    let value = node.nodeValue; // TODO: Check this
    // let value = node.nodeValue.trim();

    if (value.length === 0) {
      return undefined;
    }

    let match;
    while ((match = value.match(PARAMETER_REGEX)) !== null) {
      value = value.replace(PARAMETER_REGEX, parameters[match.groups.index]);
    }

    return value;
  }

  let element = document.createElement(node.localName);

  // Handle attributes
  if (node.attributes.length > 0) {
    
  }

  // Handle children
  for (let childNode of node.childNodes) {
    let childElement = processParameters(childNode, parameters);

    if (typeof childElement === 'undefined') {
      continue;
    } else if (typeof childElement === 'string') {
      childElement = document.createTextNode(childElement);
    }

    element.appendChild(childElement);
  }

  return element;
}
