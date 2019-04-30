export default class Component {
  constructor() {
    this.parameters = {};
  }

  render() {

  };

  /**
   * Little hack to allow appending children without creating another nesting level.
   * This element created here will be removed before it is displayed.
   *
   * @returns {HTMLElement[]}
   */
  get children() {
    return [document.createElement('children')];
  }
}
