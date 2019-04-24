import Component from "../components/Component";

export default class Random extends Component {
  render() {
    return `<h1>Random: ${this.param.random}</h1>`;
  };
}
