import Component from "../components/Component";

export default class Number extends Component {
  render() {
    const random = Math.floor(Math.random() * 10);

    return `
      <h1>Number: ${this.parameters.number}</h1>
      <p>
          Go to a page with a random number between 0 and 10: 
          <a href="#/number/${random}">Number ${random}</a>
      </p>
    `;
  };
}
