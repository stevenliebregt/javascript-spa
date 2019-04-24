export class Router {
  constructor(rootElement, routes = {}) {
    this.rootElement = rootElement;
  }

  route = () => {
    console.log(this);
  }
}
