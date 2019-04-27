/**
 * I was inspired by the following Gist: https://gist.github.com/lygaret/a68220defa69174bdec5 to build this without
 * using React, and to make it my own way.
 */

import {config} from '../config';
// import XRegExp from 'xregexp';
//
// // Makes XRegExp place groups in a 'groups' property.
// XRegExp.install({
//   namespacing: true,
// });

/**
 * Used for tagged literals to allow a JSX like experience within a template literal.
 *
 * @param parts
 * @param parameters
 * @returns {Text | Array | HTMLElement}
 */
const jsx = (parts, ...parameters) => {
  let htmlString = createHtmlString(parts);

  let parser = new DOMParser();
  let html = parser.parseFromString(htmlString, 'text/html').body.firstChild;

  return createDOM(html, parameters);
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
    if (!/__\d+/.test(value)) { // TODO: Configurable prefix
      return document.createTextNode(value);
    }

    return parseParameterizedString(value, parameters);
  }

  // 'Normal' node
  let element = document.createElement(node.localName);

  // Process attributes of node
  element = processAttributes(node, element, parameters);

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

/**
 * Parses a string with parameter placeholders.
 *
 * It replaces the placeholders with the value of the parameter.
 * If the parameter happens to be a function, then the result of said function
 * will be used instead.
 *
 * @param value A string with placeholders.
 * @param parameters The parameters passed to the tagged literal.
 * @returns {Array} A list of nodes which can be added to the DOM.
 */
const parseParameterizedString = (value, parameters) => {
  let parts = value.split(/(__\d+)/); // TODO: Configurable prefix
  let nodes = [];

  // Build up the parts to an array containing all parsed parts.
  for (let part of parts) {
    if (part.trim() === '') {
      continue;
    }

    let match = part.match(/__(\d+)/); // TODO: Config prefix
    if (match) {
      let parameter = parameters[match[1]];

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

const processAttributes = (node, element, parameters) => {
  for (let attribute of node.attributes) {
    let match = attribute.name.match(/^on([a-zA-Z]+)$/);
    if (match) {
      processEventAttribute(element, match[1], attribute, parameters);
    } else {
      processNormalAttribute(element, attribute, parameters);
    }
  }

  return element;
};

/**
 * Process event type attributes. Event type attributes are attributes like
 * onclick, onmouseover, etc.
 *
 * It is by default discouraged to use "jsxAllowEventStringEval" as it uses
 * eval to allow strings in events, and it is encouraged to pass functions to it
 * using parameters.
 * When passing a function, only 1 can be given to an event.
 *
 * @param element The element to parse for.
 * @param event The event type, "click", "mouseover", etc.
 * @param attribute The attribute we are processing.
 * @param parameters Parameters passed to the template literal.
 */
const processEventAttribute = (element, event, attribute, parameters) => {
  let value = attribute.value;
  let match;

  while ((match = value.match(/__(\d+)/)) !== null) {
    let parameter = parameters[match[1]];

    if (typeof parameter === 'function') { // We assume the function is an event handler
      element.addEventListener(event, parameter);
      return;
    }

    value = value.replace(/__(\d+)/, parameter);
  }

  if (config.jsxAllowEventStringEval || false) { //  Quite dangerous, so no by default
    element.addEventListener(event, () => eval(value));
  }
};

const processNormalAttribute = (element, attribute, parameters) => {
  let value = attribute.value;
  let match;

  while ((match = value.match(/__(\d+)/)) !== null) { // TODO: Config prefix and dupe
    value = value.replace(/__(\d+)/, parameters[match[1]]);
  }

  element.setAttribute(attribute.name, value);
};

export default jsx;
