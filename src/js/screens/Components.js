import Component from '../components/Component';
import jsx from '../render/jsx';
import FaviconImage from '../../images/favicon.png';

export default class Components extends Component {
  render() {
    return jsx`
      <div>
        <h3>Fancy Card below</h3>
        <fancy-card>
          <fancy-card-heading title="My Heading" subtitle="My Subheading"></fancy-card-heading>
          <fancy-card-content>
            <p>Oh I so hope this works</p>
            <img src="${FaviconImage}" alt="Some image" title="Some image" />
          </fancy-card-content>
        </fancy-card>
      </div>
    `;
  }
}
