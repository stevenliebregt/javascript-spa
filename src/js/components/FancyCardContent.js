import Component from './Component';
import jsx from '../render/jsx';

export default class FancyCardContent extends Component {
  render() {
    return jsx`
      <div class="fancy-card-content">
        <p>Children of this card are under here</p>
        <div class="lightblue">
          ${this.children}
        </div>
        <p>Children of this card are above here</p>
      </div>
    `;
  }
}
