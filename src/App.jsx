import { h } from 'preact';
import Router from 'preact-router';
import { createHashHistory } from 'history';
import { useState, useEffect } from 'preact/hooks';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';

import { AuthProvider } from './context/AuthContext';

const history = createHashHistory();

const App = () => {
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);
  
  const handleRoute = (e) => {
    setCurrentUrl(e.url);
  };

  return (
    <AuthProvider>
      <div id="app" class="w-full overflow-x-hidden">
        <Navbar url={currentUrl} />
        <main class="w-full">
          <Router history={history} onChange={handleRoute}>
            <Home path="/" />
            <GuestRoute path="/login" component={Login} />
            <GuestRoute path="/register" component={Register} />
            <ProtectedRoute path="/explore" component={Explore} />
            <ProtectedRoute path="/service/:id" component={ServiceDetail} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/bookings" component={Bookings} />
            <NotFound default />
          </Router>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App; 