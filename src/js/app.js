import '../scss/app.scss';
import Router from './router/Router';
import {routes} from './routes';

// Create and register router to events
const router = new Router(document.getElementById('root'), routes);

window.addEventListener('load', router.route);
window.addEventListener('hashchange', router.route);
