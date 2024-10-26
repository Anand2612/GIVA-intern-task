import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 p-4">
      <div className="container mx-auto flex justify-center items-center">
        <div className="text-white font-bold text-3xl">GIVA</div>
        <div className="space-x-4">
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
