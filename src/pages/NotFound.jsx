import { h } from 'preact';

const NotFound = () => {
  return (
    <div className="page not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
};

export default NotFound; 