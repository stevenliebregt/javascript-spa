import Component from '../components/Component';
import jsx from '../render/jsx';

export default class About extends Component {
  render() {
    const items = [
      'banana',
      'apple',
      'pear'
    ];

    return jsx`
      <div>
        <h1>About</h1>
        ${this.show}
        <h2>I'm curious</h2>
        <ul>
          ${items.map(item => {
            return jsx`<li>${item}</li>`;
          })}
        </ul>
      </div>
    `;
  };

  show = () => {
    return jsx`<p>Another test</p>`;
  };
}
