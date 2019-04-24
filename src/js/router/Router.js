import Component from "../components/Component";
import Error404 from "../screens/Error404";

export default class Router {
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
    this.routes = this.parse(routes);
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
    let matches = url.match(/:([a-z]+)/ig);

    for (let match of matches) {
      let name = match.substring(1);

      if (!(name in parameters)) {
        console.error(`Parameter "${name}" has no description in route definition`);
        continue;
      }

      url = url.replace(match, `(?<${name}>${parameters[name]})`);
    }

    return url;
  };

  route = () => {
    let request = location.hash.slice(1).toLowerCase() || '/';

    // TODO: Match

    return this.render(Error404);
  };

  render = (page) => {
    let instance = Object.create(page.prototype);

    this.rootElement.innerHTML = instance.render();
  };
}
