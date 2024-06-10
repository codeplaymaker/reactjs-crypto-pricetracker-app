import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CryptoList from './components/CryptoList';
import CoinDetail from './components/CoinDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CryptoList />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </Router>
  );
};

export default App;