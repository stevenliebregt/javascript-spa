import FancyCard from './components/FancyCard';
import FancyCardHeading from './components/FancyCardHeading';
import FancyCardContent from './components/FancyCardContent';

export const config = {
  /*
  Changes the prefix used for parameters in JSX literals, change this to
  something you don't have as text on your site.
   */
  jsxPlaceholderPrefix: '__JSX_PARAM__',
  /*
  Allows strings passed to event attributes to be eval'ed. This is very
  dangerous so it is not recommended.
   */
  jsxAllowEventStringEval: false,
  /*
  Define a list of custom elements which can be used in the JSX rendering.
  Each key is the name as how it will be used in the HTML, and the value
  is a reference to the Component class it belongs to.

  Example:

  {
    'fancy-card': FancyCard,
  }
   */
  customElements: {
    'fancy-card': FancyCard,
    'fancy-card-heading': FancyCardHeading,
    'fancy-card-content': FancyCardContent,
  },
};
