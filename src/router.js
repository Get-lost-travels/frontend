const routes = {};

// Helper function to normalize paths (remove trailing slashes)
const normalizePath = (path) => {
    return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

export const addRoute = (path, handler) => {
    routes[normalizePath(path)] = handler;
};

export const navigateTo = (path) => {
    history.pushState(null, null, path);
    handleLocation();
};

const handleLocation = async () => {
    const path = normalizePath(window.location.pathname);
    const handler = routes[path] || routes['/404'];
    if (typeof handler === 'function') {
        handler();
    } else if (typeof handler === 'string') {
        const response = await fetch(handler);
        document.querySelector('#app').innerHTML = await response.text();

        // Load scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach((script) => {
            const newScript = document.createElement('script');

            newScript.src = script.src;
            newScript.type = script.type;
            newScript.async = script.async;
            newScript.defer = script.defer;
            newScript.text = script.text;

            script.replaceWith(newScript);
        });
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