import { addRoute } from './router.js';
import './style.css';

const pages = import.meta.glob('/src/pages/**/*.html');

for (const path in pages) {
  let routePath = path.replace('/src/pages', '').replace('.html', '');
  if (routePath.endsWith('/index')) {
    routePath = routePath.replace('/index', '');
  }
  addRoute(routePath === '' ? '/' : routePath, path);
}

const notFoundHandler = () => {
  document.querySelector('#app').innerHTML = '<h1>404</h1><p>Page not found.</p>';
};

addRoute('/404', notFoundHandler);