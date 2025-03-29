const routes = {};

export const addRoute = (path, handler) => {
  routes[path] = handler;
};

export const navigateTo = (path) => {
  history.pushState(null, null, path);
  handleLocation();
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const handler = routes[path] || routes['/404'];
  if (typeof handler === 'function') {
    handler();
  } else if (typeof handler === 'string') {
    const response = await fetch(handler);
    document.querySelector('#app').innerHTML = await response.text();

    document.dispatchEvent(new Event('ContentLoad'));

  }
};

window.onpopstate = handleLocation;
window.route = navigateTo;

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  handleLocation();
});

document.addEventListener("ContentLoad", () => {
    let app = document.querySelector('#app');
    const scripts = app.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.textContent = script.textContent;

      script.parentNode.replaceChild(newScript, script);
    });
});
