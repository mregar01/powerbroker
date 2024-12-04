import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister';
import Leaderboard from './Components/Leaderboard';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
