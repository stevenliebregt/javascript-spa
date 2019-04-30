export default class Component {
  constructor() {
    this.parameters = {};
    this.state = {};
  }

  render() {

  };

  setState(state) {
    this.state = {...this.state, ...state};

    console.log(this.render());
  }
}
