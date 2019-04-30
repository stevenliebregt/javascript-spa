import Component from './Component';
import jsx from '../render/jsx';

export default class FancyCard extends Component {
  render() {
    return jsx`
      <div class="fancy-card">
        ${this.children}
      </div>
    `;
  }
}
