import { isAuthenticated, logout } from '../api/auth.js';
import './navbar.css';

/**
 * Generates a navbar element with the current route highlighted
 * @param {string} currentPath - The current path/route
 * @returns {HTMLElement} The navbar element
 */
export function createNavbar(currentPath = window.location.pathname) {
  const navbar = document.createElement('nav');
  navbar.className = 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md navbar-fixed';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-3 flex items-center justify-between';
  navbar.appendChild(container);
  
  const brand = document.createElement('a');
  brand.href = '/';
  brand.className = 'text-xl font-bold flex items-center';
  brand.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Lost Travels
  `;
  container.appendChild(brand);
  
  const mobileMenuBtn = document.createElement('button');
  container.appendChild(mobileMenuBtn);
  
  const linksContainer = document.createElement('div');
  linksContainer.className = 'nav-links-container md:flex md:items-center';
  linksContainer.id = 'navbar-menu';
  container.appendChild(linksContainer);
  
  const linksList = document.createElement('div');
  linksList.className = 'md:flex md:items-center';
  linksContainer.appendChild(linksList);
  
  const links = [
    { 
      path: '/', 
      label: 'Home', 
      visibleWhen: 'always',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
    },
    { 
      path: '/explore', 
      label: 'Explore', 
      visibleWhen: 'always',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>'
    },
    { 
      path: '/login', 
      label: 'Login', 
      visibleWhen: 'guest',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>'
    },
    { 
      path: '/register', 
      label: 'Register', 
      visibleWhen: 'guest',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>'
    },
    { 
      path: '/', 
      label: 'Logout', 
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>',
      action: 'logout'
    },
  ];
  
  links.forEach(link => {
    const isAuth = isAuthenticated();
    if (
      (link.visibleWhen === 'always') || 
      (link.visibleWhen === 'authenticated' && isAuth) || 
      (link.visibleWhen === 'guest' && !isAuth)
    ) {
      const navLink = document.createElement('a');
      navLink.href = link.path;
      
      const baseClasses = 'nav-link px-4 py-2 mx-1 hover:bg-blue-700 rounded flex items-center transition-all duration-200';
      if (currentPath === link.path && link.action !== 'logout') {
        navLink.className = `${baseClasses} active font-semibold bg-blue-800 shadow-inner`;
      } else {
        navLink.className = baseClasses;
      }
      
      navLink.innerHTML = `${link.icon} ${link.label}`;
      
      if (link.action === 'logout') {
        navLink.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
          window.location.href = '/';
        });
      }
      
      linksList.appendChild(navLink);
    }
  });
  
  mobileMenuBtn.addEventListener('click', () => {
    const menu = document.getElementById('navbar-menu');
    menu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
  
  return navbar;
}

/**
 * Renders the navbar into the specified container
 * @param {string|HTMLElement} container - Container element or selector
 */
export function renderNavbar(container) {
  const targetContainer = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
    
  if (!targetContainer) {
    console.error('Navbar container not found');
    return;
  }
  
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/register') {
    return;
  }
  
  const navbar = createNavbar();
  
  if (targetContainer.firstChild) {
    targetContainer.insertBefore(navbar, targetContainer.firstChild);
  } else {
    targetContainer.appendChild(navbar);
  }
} 