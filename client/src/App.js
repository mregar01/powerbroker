// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Leaderboard from './Components/Leaderboard';
import User from './Components/User';
import Message from './Components/MessageBoard'

function App() {
  return (
    <Router>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/user/:username" element={<User />} />
          <Route path="/message" element={<Message />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
