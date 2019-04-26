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

  let dom = createDOM(html, parameters);

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

function createDOM(node, parameters) {
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

    return parseParameterized(value, parameters);
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
}

function parseParameterized(value, parameters) {
  let parts = value.split(/(__\d+)/);
  let nodes = [];

  for (let part of parts) {
    if (part.trim() === '') {
      continue;
    }

    let match = part.match(PARAMETER_REGEX);
    if (match) {
      nodes.push(document.createTextNode('[[PARAMETER]]'));
      continue;
    }

    nodes.push(document.createTextNode(part));
  }

  return nodes;
  // let parsed = [];
  //
  // let match;
  // while ((match = value.match(PARAMETER_REGEX)) !== null) {
  //   let parameter = parameters[match.groups.index];
  //   console.log(parameter);
  //   value = value.replace(PARAMETER_REGEX, ''); // Remove match
  // }
  //
  // console.log(value);
  //
  // return parsed;
}
