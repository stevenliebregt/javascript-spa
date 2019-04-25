import Component from '../components/Component';
import jsx from '../render/jsx';

export default class Home extends Component {
  render() {
    const foo = 123;
    const bar = 456;

    return jsx`
<div>
  <h1>Home</h1>
  <div class="sub">
    <p>This is subtext</p>
  </div>
  <p>Test: ${foo} &amp; ${bar}</p>
  <button onclick="${this.onClick}">Click</button>
</div>
    `;
  };

  onClick = (event) => {
    console.log('clicked with: ', event);
  };
}
