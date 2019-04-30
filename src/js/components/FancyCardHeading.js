import Component from './Component';
import jsx from '../render/jsx';

export default class FancyCardHeading extends Component {
  render() {
    return jsx`
      <h2 class="fancy-card-heading">
        {title} <br/>
        <small>{subtitle}</small>
      </h2>
    `;
  }
}
