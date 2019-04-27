import Component from '../components/Component';
import Error404 from '../screens/Error404';
import XRegExp from 'xregexp';

// Makes XRegExp place groups in a 'groups' property.
XRegExp.install({
  namespacing: true,
});

const PARAMETER_REGEX = /:([a-z0-9_\-]+)/ig;

export default class Router {
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
    this.usedGroupNames = {};
    this.routes = this.parse(routes);
    this.regex = this.createRegex();
  }

  parse = (routes, prefix = '', parameters = {}, parsedRoutes = {}) => {
    for (let [url, definition] of Object.entries(routes)) {
      url = prefix + url;
      definition = this.prepare(definition, parameters);

      // Process groups
      if ('children' in definition) {
        parsedRoutes = this.parse(definition['children'], url, (definition['parameters'] || {}), parsedRoutes);

        if (!('page' in definition)) { // Group leader is not a page
          continue;
        }
      }

      // Replace parameters with regular expressions
      [url, definition] = url.indexOf(':') > -1 ? this.transform(url, definition) : [url, definition];

      parsedRoutes[url.replace(/\//g, '\\/')] = definition;
    }

    return parsedRoutes;
  };

  /**
   * Turn the definition and optional parent parameters into a common format.
   *
   * @param definition
   * @param parameters
   * @returns {{page: *, parameters: {}}}
   */
  prepare = (definition, parameters) => {
    // Normalize
    if (definition.__proto__.name === Component.name) {
      definition = {
        page: definition,
        parameters: {},
      }
    }

    definition.usedParameters = [];

    // Inherit parameters
    definition.parameters = {...definition.parameters || {}, ...parameters};

    return definition;
  };

  transform = (url, definition) => {
    let match;
    while ((match = PARAMETER_REGEX.exec(url))) {
      let name = match[1];

      if (!(name in definition.parameters)) {
        console.error(`Parameter "${name}" has no description in route definition`);
        continue;
      }

      // Transform group name, since you can only use a name once in a single expression
      let regexName = (name in this.usedGroupNames) ? `${name}_${this.usedGroupNames[name]}` : name;
      url = url.replace(PARAMETER_REGEX, `(?<${regexName}>${definition.parameters[name]})`);

      definition.usedParameters.push(regexName);
      this.usedGroupNames[name] = (name in this.usedGroupNames) ? this.usedGroupNames[name] + 1 : 1;
    }

    return [url, definition];
  };

  createRegex = () => {
    let routes = [];

    Object.keys(this.routes).forEach((route, index) => {
      routes.push(`(?<_k${index}>${route})`);
    });

    return XRegExp(`^(?:${routes.join('|')})$`);
  };

  route = () => {
    let request = location.hash.slice(1).toLowerCase() || '/';
    let match = XRegExp.exec(request, this.regex);

    if (match === null) {
      return this.render({
        page: Error404,
      });
    }

    for (let [key, value] of Object.entries(match.groups)) {
      let indexMatch = XRegExp.exec(key, XRegExp('^_k(?<index>\\d+)$'));
      if (!(indexMatch) || typeof value === 'undefined') {
        continue;
      }

      let index = parseInt(indexMatch.groups.index);
      let definition = Object.values(this.routes)[index];

      return this.render(definition, match.groups);
    }

    return this.render({
      page: Error404,
    });
  };

  render = (definition, parameters = {}) => {
    console.log('render =>', definition.usedParameters);
  };
}
