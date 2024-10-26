import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductManagement from './components/ProductManagement';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
  