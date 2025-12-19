import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import PlantCare from './pages/PlantCare';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Routes>
        {/* Admin Routes - No Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Customer Routes - With Navbar/Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/plant-care" element={<PlantCare />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
