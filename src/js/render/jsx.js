/**
 * I was inspired by the following Gist: https://gist.github.com/lygaret/a68220defa69174bdec5 to build this without
 * using React, and to make it my own way.
 */

import {config} from '../config';

const PARAMETER_REGEX = new RegExp(`${config.jsxPlaceholderPrefix || '__JSX_PARAM__'}(\\d+)`);

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
      htmlString += `${config.jsxPlaceholderPrefix || '__JSX_PARAM__'}${index}`;
    }
  });

  return htmlString;
};

/**
 * Turn the DOMParser result into our useful DOM with processed attributes.
 *
 * @param node The first child of the DOMParser result.
 * @param parameters The parameters passed to the template literal.
 * @returns {HTMLElement|Text|Array}
 */
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
  let element;
  if (node.localName in config.customElements) {
    element = new config.customElements[node.localName]().render();
  } else {
    element = document.createElement(node.localName);
  }

  // Process attributes of node
  element = processAttributes(node, element, parameters);

  // Check children
  for (let childNode of node.childNodes) {
    let childElement = createDOM(childNode, parameters);

    if (typeof childElement !== 'undefined') {
      if (node.localName in config.customElements) {
        insertCustomChild(element, childElement);
      } else {
        insertNormalChild(element, childElement);
      }
    }
  }

  return element;
};

const insertCustomChild = (element, childElement) => {
  let childrenElements = element.getElementsByTagName('children');
  if (childrenElements.length < 1) { // The target doesnt have a place for children
    return;
  }
  let childrenElement = childrenElements[0];

  if (childElement instanceof Array) {
    childElement.forEach(child => {
      childrenElement.parentNode.insertBefore(child, childrenElement);
    });
  } else {
    childrenElement.parentNode.insertBefore(childElement, childrenElement);
  }
};

const insertNormalChild = (element, childElement) => {
  if (childElement instanceof Array) {
    childElement.forEach(child => {
      element.append(child);
    });
  } else {
    element.append(childElement);
  }
};

const removeChildrenPlaceholders = () => {
  let childrenElements = element.getElementsByTagName('children');

  if (childrenElements.length < 1) { // The target doesnt have a place for children
    return;
  }


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
  let splitRegex = new RegExp(`(${config.jsxPlaceholderPrefix || '__JSX_PARAM__'}\\d+)`);
  let parts = value.split(splitRegex);
  let nodes = [];

  // Build up the parts to an array containing all parsed parts.
  for (let part of parts) {
    if (part.trim() === '') {
      continue;
    }

    let match = part.match(PARAMETER_REGEX);
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

/**
 * Process a node's attribute.
 *
 * If the name of the event is one of events, like 'onclick', 'onmouseover' it will be
 * removed from the node, and set as an event handler.
 *
 * @param node The node to process.
 * @param element The element to apply the attributes to.
 * @param parameters The parameters passed to the template literal.
 * @returns {HTMLElement} The element with updated attributes and event handlers.
 */
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

  while ((match = value.match(PARAMETER_REGEX)) !== null) {
    let parameter = parameters[match[1]];

    if (typeof parameter === 'function') { // We assume the function is an event handler
      element.addEventListener(event, parameter);
      return;
    }

    value = value.replace(PARAMETER_REGEX, parameter);
  }

  if (config.jsxAllowEventStringEval || false) { //  Quite dangerous, so no by default
    element.addEventListener(event, () => eval(value));
  }
};

/**
 * Apply 'normal' attributes to an element.
 *
 * If there are any parameters in the attribute, they will be replaced by
 * their values.
 *
 * @param element The element to process.
 * @param attribute The attribute we are processing.
 * @param parameters The parameters passed to the template literal.
 */
const processNormalAttribute = (element, attribute, parameters) => {
  let value = attribute.value;
  let match;

  while ((match = value.match(PARAMETER_REGEX)) !== null) {
    value = value.replace(PARAMETER_REGEX, parameters[match[1]]);
  }

  element.setAttribute(attribute.name, value);
};

export default jsx;
