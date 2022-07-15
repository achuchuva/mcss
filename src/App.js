import './App.css';
import Destination from './Destination';
import Login from './Login';
import Menu from './Menu';
import Map from './Map';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("api_key") !== null) {
      navigate("/menu");
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/map" element={<Map />} />
        <Route path="/destination" element={<Destination />} />
      </Routes>
    </div>
  );
}

export default App;
