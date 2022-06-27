import './App.css';
import Destination from './Destination';
import Login from './Login';
import Menu from './Menu';
import Map from './Map';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/map" element={<Map />} />
            <Route path="/destination" element={<Destination />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
