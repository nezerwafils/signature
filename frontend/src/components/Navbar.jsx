import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Compass, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VentlyLogo from './VentlyLogo';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <VentlyLogo size={32} />
          <span className="logo-text">Vently</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/discover" className="nav-link">
            <Compass size={20} />
            <span>Discover</span>
          </Link>
          <Link to="/search" className="nav-link">
            <Search size={20} />
            <span>Search</span>
          </Link>
          <Link to={`/profile/${user?.username}`} className="nav-link">
            <User size={20} />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
