import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-main">
      <div className="text-center animate-fade-in">
        <div className="text-9xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-main mb-2">Page Not Found</h1>
        <p className="text-muted mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          <HiOutlineArrowLeft />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
