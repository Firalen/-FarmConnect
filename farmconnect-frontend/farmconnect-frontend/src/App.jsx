import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Chat from './pages/Chat';
import Orders from './pages/Orders';
import Articles from './pages/Articles';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email/:token" element={<EmailVerification />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 