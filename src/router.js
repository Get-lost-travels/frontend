const app = document.getElementById('app');

const routes = new Map();

export function addRoute(path, handler) {
    routes.set(path, handler);
}

/*
 * Page loading functions
 */

async function loadPage(pagePath) {
    try {
        const response = await fetch(pagePath);
        const html = await response.text();
        app.innerHTML = html;
    } catch (error) {
        console.error(`Error loading page ${pagePath}:`, error);
        notFoundHandler();
    }
}

async function loadHomePage() {
    await loadPage('/src/pages/index.html');
}

async function loadRegisterPage() {
    await loadPage('/src/pages/register/index.html');
    const { initializeRegister } = await import('./pages/register/register.js');
    initializeRegister();
}

async function loadLoginPage() {
    await loadPage('/src/pages/login/index.html');
    const { initializeLogin } = await import('./pages/login/login.js');
    initializeLogin();
}


/*
 * Router registration 
 */

addRoute('/', loadHomePage);
addRoute('/register', loadRegisterPage);
addRoute('/login', loadLoginPage);


/*
 * Router event listeners
 */

export function initRouter() {
    const path = window.location.pathname;
    const handler = routes.get(path) || routes.get('/404');
    
    if (handler) {
        handler();
    }
}

export function notFoundHandler() {
    app.innerHTML = '<h1>404 - Page Not Found</h1>';
}

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const handler = routes.get(path) || routes.get('/404');
    if (handler) {
        handler();
    }
});