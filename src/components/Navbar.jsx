import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Link, route, getCurrentUrl } from 'preact-router';
import { useAuth } from '../context/AuthContext';
import '../components/navbar.css';

const PATHS_WHERE_NAVBAR_IS_HIDDEN = ['/', '/#/', '#/'];

const Navbar = (props) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = props.url || getCurrentUrl();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    route('/', true);
  };

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const links = [
    { 
      path: '/explore', 
      label: 'Explore', 
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
    },
    // Show for customers only
    user && user.role === 'customer' && {
      path: '/bookings',
      label: 'My Bookings',
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    },
    // Show for agencies only
    user && user.role === 'agency' && {
      path: '/agency-bookings',
      label: 'Agency Bookings',
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    },
    user && user.role === 'agency' && {
      path: '/agency-offers',
      label: 'Create Offer',
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>'
    },
    { 
      path: '/', 
      label: 'Logout', 
      visibleWhen: 'authenticated',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>',
      action: 'logout'
    }
  ].filter(Boolean);

  const renderLinks = () => {
    return links.map(link => {
      if ((link.visibleWhen === 'always') || 
          (link.visibleWhen === 'authenticated' && isAuthenticated) || 
          (link.visibleWhen === 'guest' && !isAuthenticated)) {

        const baseClasses = 'nav-link px-4 py-2 mx-1 hover:bg-blue-700 rounded flex items-center transition-all duration-200';
        const active = link.action !== 'logout' && isActive(link.path);
        const linkClasses = active 
          ? `${baseClasses} active font-semibold bg-blue-800 shadow-inner`
          : baseClasses;
          
        if (link.action === 'logout') {
          return (
            <a 
              href={link.path} 
              class={linkClasses}
              onClick={handleLogout}
              dangerouslySetInnerHTML={{ __html: `${link.icon} ${link.label}` }}
            />
          );
        } else {
          return (
            <Link 
              href={link.path} 
              class={linkClasses}
              activeClassName="active font-semibold bg-blue-800 shadow-inner"
              dangerouslySetInnerHTML={{ __html: `${link.icon} ${link.label}` }}
            />
          );
        }
      }
      return null;
    });
  };

  const shouldHideNavbar = () => {
    // Check exact paths first
    if (PATHS_WHERE_NAVBAR_IS_HIDDEN.includes(currentPath)) {
      return true;
    }
    
    // Check for login and register paths with any prefix/suffix
    const pathLower = currentPath.toLowerCase();
    if (pathLower.includes('login') || pathLower.includes('register')) {
      return true;
    }
    
    return false;
  };
  
  if (shouldHideNavbar()) {
    return null;
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <nav class="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md navbar-fixed w-full">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/explore" class="text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lost Travels
        </a>
        
        <button 
          class={isMenuOpen ? 'active' : ''}
          onClick={toggleMenu}
        >
          <div class="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div class={`nav-links-container ${isMenuOpen ? 'active' : ''}`} id="navbar-menu">
          <div class="md:flex md:items-center">
            {renderLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;