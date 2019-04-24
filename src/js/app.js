import '../scss/app.scss';
import {Router} from './components/Router';
import {routes} from './routes';

// Create router
const router = new Router(document.getElementById('root'), routes);

window.addEventListener('load', router.route);
window.addEventListener('hashchange', router.route);
