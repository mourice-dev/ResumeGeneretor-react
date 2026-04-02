import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-black no-underline">
          <img
            src="/brand/resume-logo.png"
            alt="ResumE logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tighter">
            Resum<span className="font-black text-2xl leading-none">E</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Dashboard</Link>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Log In</Link>
              <Link to="/register" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all active:scale-95">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
