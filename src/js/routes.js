import Home from './screens/Home';
import About from './screens/About';
import Number from './screens/Number';

export const routes = {
  '/': Home,
  '/about-this': About,
  '/:number': {
    page: Home,
    parameters: {
      number: '\\d+',
    }
  },
  '/number/:number': {
    page: Number,
    parameters: {
      number: '\\d+',
    },
  },
};
