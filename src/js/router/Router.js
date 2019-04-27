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

      let regexName = (name in this.usedGroupNames) ? `${name}_${this.usedGroupNames[name]}` : name;
      url = url.replace(PARAMETER_REGEX, `(?<${regexName}>${definition.parameters[name]})`);

      // TODO: Notify definition
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
    let matches = XRegExp.exec(request, this.regex);

    console.log(matches);
  };

  // render = (definition, parameters = {}) => {
  //   console.log('render =>', definition, parameters);
  // };
}
