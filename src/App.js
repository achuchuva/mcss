import './App.css';
import Destination from './Destination';
import Login from './Login';
import Menu from './Menu';
import Map from './Map';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate();

  // Runs when the component mounts (initialises) and checks to see if an API key is present
  // If it is, the user is logged in and taken to the menu
  useEffect(() => {
    if (localStorage.getItem("api_key") !== null) {
      navigate("/menu");
    }
  }, []);

  // Return function displays all different routes of the frontend
  // This way, the App displays all the components but also gives the illusion of navigating
  // between pages
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
