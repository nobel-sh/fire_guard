import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminComponent from './admin';
import MapWithFireLocation from './map';
import Navbar from './navbar';

const locations = [
  { name: 'Pokhara', lat: 28.2096, lng: 83.9856, useFireIcon: true },
];

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminComponent locations={locations} />} />
          <Route path="/" element={<MapWithFireLocation locations={locations} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
