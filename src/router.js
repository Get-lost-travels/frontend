import { isAuthenticated } from './api/auth.js';
import { renderNavbar } from './components/navbar.js';

const app = document.getElementById('app');

const routes = new Map();

/*
 * Route for any user (logged in or not)
 */

export function addRoute(path, handler) {
    routes.set(path, handler);
}

/*
 * Route for logged in users
 */
export function addProtectedRoute(path, handler) {
    routes.set(path, async () => {
        if (!isAuthenticated()) {
            window.history.pushState({}, '', '/login');
            const loginHandler = routes.get('/login');
            if (loginHandler) loginHandler();
            return;
        }
        await handler();
    });
}

/*
 * Route for logged out users only
 */
export function addGuestRoute(path, handler) {
    routes.set(path, async () => {
        if (isAuthenticated()) {
            window.history.pushState({}, '', '/explore');
            const exploreHandler = routes.get('/explore');
            if (exploreHandler) exploreHandler();
            return;
        }
        await handler();
    });
}

/*
 * Page loading functions
 */

async function loadPage(pagePath) {
    try {
        const response = await fetch(pagePath);
        const html = await response.text();
        
        app.innerHTML = html;
        
        renderNavbar(app);
        
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

async function loadExplorePage() {
    await loadPage('/src/pages/explore/index.html');
    const { initializeExplore } = await import('./pages/explore/explore.js');
    initializeExplore();
}

/*
 * Router registration 
 */

addRoute('/', loadHomePage);
addGuestRoute('/register', loadRegisterPage);
addGuestRoute('/login', loadLoginPage);
addProtectedRoute('/explore', loadExplorePage);


/*
 * Router event listeners
 */

export function initRouter() {
    const path = window.location.pathname;
    const handler = routes.get(path) || routes.get('/404') || notFoundHandler;
    
    if (handler) {
        handler();
    }
}

export function notFoundHandler() {
    app.innerHTML = '<h1>404 - Page Not Found</h1>';
    renderNavbar(app);
}

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const handler = routes.get(path) || routes.get('/404');
    if (handler) {
        handler();
    }
});