import Component from '../components/Component';
import jsx from '../render/jsx';

export default class About extends Component {
  render() {
    return jsx`
      <div>
        <h1>About</h1>
        ${this.show()}
      </div>
`;
  };

  show = () => {
    return jsx`<p>Another test</p>`;
  };
}
