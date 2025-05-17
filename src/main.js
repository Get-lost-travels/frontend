import './style.css';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Main.js: DOM loaded, initializing router');
    initRouter();
});
