import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
    <div className="font-bold text-xl">
      <Link to="/">FarmConnect</Link>
    </div>
    <div className="space-x-4">
      <Link to="/products">Products</Link>
      <Link to="/articles">Articles</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </nav>
);

export default Navbar; 