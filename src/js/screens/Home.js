import Component from '../components/Component';
import jsx from '../render/jsx';

export default class Home extends Component {
  render() {
    const items = [
      'banana',
      'pear',
      'apple',
    ];

    const param1 = 2;
    const param2 = 4;
    const param3 = 6;

    return jsx`
      <div>
        <h1>Home & something cool for only &euro; 10.-</h1>
        <p>${param1}+${param2}=${param3}</p>
        ${this.styledName}
        <ol>${items.map(item => jsx`<li>Item: ${item}</li>`)}</ol>
      </div>
    `;
  };

  styledName = () => {
    return jsx`<p>Gustav</p>`;
  };
}
