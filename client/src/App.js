import React, { useEffect, useState } from 'react';

function App() {
  // States for progress and user input
  const [progress, setProgress] = useState([]);
  const [user, setUser] = useState('');
  const [page, setPage] = useState('');

  // Fetch leaderboard data
  useEffect(() => {
    fetch('/api/progress')
      .then((response) => response.json())
      .then((data) => {
        setProgress(data);
      })
      .catch((error) => console.error('Error fetching progress:', error));
  }, []);

  // Update user progress
  const updateProgress = () => {
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, page: parseInt(page, 10) }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setProgress(data.progress); // Update leaderboard
      })
      .catch((error) => console.error('Error updating progress:', error));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Book Progress Tracker</h1>
      
      {/* Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Your Name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Page Number"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={updateProgress}>Update Progress</button>
      </div>
      
      {/* Leaderboard Section */}
      <h2>Leaderboard</h2>
      <ul>
        {progress
          .sort((a, b) => b.page - a.page) // Sort by progress in descending order
          .map((user, index) => (
            <li key={index}>
              {user.user}: {user.page} pages
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
