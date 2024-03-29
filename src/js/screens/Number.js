import Component from '../components/Component';
import jsx from '../render/jsx';

export default class Number extends Component {
  render() {
    const rand = () => Math.floor(Math.random() * 10);

    let random = rand();
    while (random === parseInt(this.parameters.number)) {
      random = rand();
    }

    return jsx`
      <div>
        <h1>Number: ${this.parameters.number}</h1>
        <p>
          Go to a page with a random number between 0 and 10: 
          <a href='#/number/${random}'>Number ${random}</a>
        </p>
      </div>
    `;
  };
}
