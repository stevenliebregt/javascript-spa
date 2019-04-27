import Component from '../components/Component';
import Error404 from '../screens/Error404';
import XRegExp from 'xregexp';

// Makes XRegExp place groups in a 'groups' property.
XRegExp.install({
  namespacing: true,
});

export default class Router {
  /**
   * Create a new router instance.
   *
   * @param {HTMLElement} rootElement The root element on the page, this is
   * where the screen HTML is inserted.
   * @param  {{}} routes A list of routes.
   */
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
    this.usedGroupNames = {};
    this.routes = this.parse(routes);
    this.regex = this.createRegex();
  }

  /**
   * Process each route and clean it up and replace parameters with
   * regular expressions.
   *
   * @param {{}} routes A list of routes.
   * @param {string} prefix The prefix of the current group.
   * @param {{}} parameters A list of parameters. Used so children inherit the
   * parameters of their parent.
   * @param {{}} parsedRoutes A list of routes we have already parsed.
   */
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
   * @param {Class|Component|{}} definition The route definition.
   * @param {{}} parameters The parameters for this definition.
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

    definition.usedParameters = {};

    // Inherit parameters
    definition.parameters = {...definition.parameters || {}, ...parameters};

    return definition;
  };

  /**
   * Replace parameter names with their associated regular expressions.
   *
   * @param {string} url The URL to transform.
   * @param {{}} definition The definition for the URL.
   * @returns {[]} The URL and the definition.
   */
  transform = (url, definition) => {
    let parameterRegex = /:([a-z0-9_\-]+)/ig;

    let match;
    while ((match = parameterRegex.exec(url))) {
      let name = match[1];

      if (!(name in definition.parameters)) {
        console.error(`Parameter "${name}" has no description in route definition`);
        continue;
      }

      // Transform group name, since you can only use a name once in a single expression
      let regexName = (name in this.usedGroupNames) ? `${name}_${this.usedGroupNames[name]}` : name;
      url = url.replace(parameterRegex, `(?<${regexName}>${definition.parameters[name]})`);

      definition.usedParameters[name] = regexName;
      this.usedGroupNames[name] = (name in this.usedGroupNames) ? this.usedGroupNames[name] + 1 : 1;
    }

    return [url, definition];
  };

  /**
   * Create a big regular expression from all routes.
   *
   * @returns {XRegExp} A regular expression where each route is in a separate group.
   */
  createRegex = () => {
    let routes = [];

    Object.keys(this.routes).forEach((route, index) => {
      routes.push(`(?<_k${index}>${route})`);
    });

    return XRegExp(`^(?:${routes.join('|')})$`);
  };

  /**
   * Handle a request.
   *
   * If the route is not matched it will return a {@code Error404} page.
   */
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

  /**
   * Render the matched (or 404) route.
   *
   * @param {{}} definition The definition of the matched route.
   * @param {{}} parameters The parameters from the request.
   */
  render = (definition, parameters = {}) => {
    // Create page instance with parameters
    let pageInstance = new definition.page();

    for (let [name, regexName] of Object.entries(definition.usedParameters || {})) {
      if (regexName in parameters) {
        pageInstance.parameters[name] = parameters[regexName];
      }
    }

    // Get the HTML and replace the root
    let html = pageInstance.render();

    // Check if we used JSX or not
    if (html instanceof HTMLElement || html instanceof Text) {
      // Remove old HTML
      while (this.rootElement.hasChildNodes()) {
        this.rootElement.removeChild(this.rootElement.firstChild);
      }

      // Set new HTML
      this.rootElement.appendChild(html);
    } else {
      this.rootElement.innerHTML = html;
    }
  };
}
