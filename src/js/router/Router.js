import Component from '../components/Component';
import Error404 from '../screens/Error404';

const ROUTE_KEY_REGEX = /^_k(?<index>\d+)$/;
const PARAMETER_REGEX = /:([a-z0-9_\-]+)/ig;

export default class Router {
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
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

        if (!('page' in definition)) { // The 'group' can also ba a page
          continue;
        }
      }

      // Replace parameters with regular expressions
      url = url.indexOf(':') > -1 ? this.transform(url, definition.parameters) : url;

      parsedRoutes[url.replace(/\//g, '\\/')] = definition;
    }

    return parsedRoutes;
  };

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

  transform = (url, parameters) => {
    let matches = url.match(PARAMETER_REGEX);

    for (let match of matches) {
      let name = match.substring(1);
      if (ROUTE_KEY_REGEX.test(name)) {
        console.error(`Parameter names must match the format ${PARAMETER_REGEX}`);
        continue;
      }

      if (!(name in parameters)) {
        console.error(`Parameter "${name}" has no description in route definition`);
        continue;
      }

      url = url.replace(match, `(?<${name}>${parameters[name]})`);
    }

    return url;
  };

  createRegex = () => {
    let routes = [];

    Object.keys(this.routes).forEach((route, index) => {
      routes.push(`(?<_k${index}>${route})`);
    });

    return new RegExp(`^(?:${routes.join('|')})$`);
  };

  route = () => {
    let request = location.hash.slice(1).toLowerCase() || '/';
    let match = this.regex.exec(request);

    if (match === null) {
      return this.render({
        page: Error404,
      });
    }

    for (let [key, value] of Object.entries(match.groups)) {
      let indexMatch = ROUTE_KEY_REGEX.exec(key);
      if (!(indexMatch) || typeof value === 'undefined') {
        continue;
      }

      let index = parseInt(indexMatch.groups.index);
      let route = Object.values(this.routes)[index];

      return this.render(route, match.groups);
    }

    return this.render({
      page: Error404,
    });
  };

  render = (route, matches = {}) => {
    let instance = new route.page();

    for (let key of Object.keys(route.parameters || {})) {
      if (key in matches) {
        instance.parameters[key] = matches[key];
      }
    }

    // Remove old HTML
    while (this.rootElement.hasChildNodes()) {
      this.rootElement.removeChild(this.rootElement.firstChild);
    }

    // Set new HTML
    this.rootElement.appendChild(instance.render());
  };
}
