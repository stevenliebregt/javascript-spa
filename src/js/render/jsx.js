/**
 * I was inspired by the following Gist: https://gist.github.com/lygaret/a68220defa69174bdec5 to build this without
 * using React.
 */

import {config} from '../config';

const PARAMETER_REGEX = new RegExp(`${config.jsxPlaceholderPrefix || '__'}(?<index>\\d+)`);

const jsx = (parts, ...parameters) => {
  let htmlString = createHtmlString(parts);

  let parser = new DOMParser();
  let html = parser.parseFromString(htmlString, 'text/html').body.firstChild;

  // console.log(html);

  let dom = createDOM(html, parameters);

  return dom;
};

/**
 * Turn the literal parts into a HTML string and replace the parameters with
 * placeholders.
 *
 * @param parts The parts of a tagged literal.
 * @returns {string} A HTML string.
 */
const createHtmlString = (parts) => {
  let htmlString = '';

  parts.forEach((item, index) => {
    htmlString += item;

    // Put a placeholder instead of the parameter
    if (index !== parts.length - 1) {
      htmlString += `${config.jsxPlaceholderPrefix || '__'}${index}`;
    }
  });

  return htmlString;
};

const createDOM = (node, parameters) => {
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

    return parseParameterizedString(value, parameters);
  }

  // 'Normal' node
  let element = document.createElement(node.localName);

  // Check children
  for (let childNode of node.childNodes) {
    let childElement = createDOM(childNode, parameters);

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
};

const  parseParameterizedString = (value, parameters) => {
  let parts = value.split(/(__\d+)/);
  let nodes = [];

  for (let part of parts) {
    if (part.trim() === '') {
      continue;
    }

    let match = part.match(PARAMETER_REGEX);
    if (match) {
      let parameter = parameters[match.groups.index];

      if (typeof parameter === 'function') {
        nodes.push(parameter());
      } else if (parameter instanceof Array) {
        parameter.forEach(item => nodes.push(item));
      } else {
        nodes.push(document.createTextNode(parameter));
      }

      continue;
    }

    nodes.push(document.createTextNode(part));
  }

  return nodes;
};

export default jsx;
