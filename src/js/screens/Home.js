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

    const shade = Math.random() >= 0.5 ? 'dark' : 'light';
    const color = Math.random() >= 0.5 ? 'green' : 'blue';

    const idea = Math.random() >= 0.5 ? 'good' : 'bad';

    return jsx`
      <div class="red">
        <h1 onmouseover="console.log('this is a ${idea} idea')">Home & something cool for only &euro; 10.-</h1>
        <p class="${shade}${color}">I will be: light${color}</p>
        <p>${param1}+${param2}=${param3}</p>
        ${this.styledName}
        <ol>${items.map(item => jsx`<li>Item: ${item}</li>`)}</ol>
        <button onclick="${this.onClick}" data-name="myButton">Click me!</button>
      </div>
    `;
  };

  styledName = () => {
    return jsx`<p class="blue">Gustav</p>`;
  };

  onClick = (event) => {
    alert(`You clicked me, my name is: "${event.target.dataset.name}"`);
  };
}
