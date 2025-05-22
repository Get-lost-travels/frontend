import { h } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const GuestRoute = ({ component: Component, ...props }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div class="flex h-screen items-center justify-center bg-[#16325B]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    route('/explore', true);
    return null;
  }
  
  return <Component {...props} />;
};

export default GuestRoute; 