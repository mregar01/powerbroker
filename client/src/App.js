import React, { useEffect, useState } from 'react';

function App() {
  // States for progress and user input
  const [progress, setProgress] = useState([]);
  const [user, setUser] = useState('');
  const [page, setPage] = useState('');

  // Fetch leaderboard data
  useEffect(() => {
    fetch('https://powerbroker.onrender.com/api/progress')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch progress');
            }
            return response.json();
        })
        .then((data) => {
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }
            setProgress(data); // Update state with the fetched progress data
        })
        .catch((error) => {
            console.error('Error fetching progress:', error);
            setProgress([]); // Handle errors by resetting progress
        });
}, []);

const sortedProgress = (progress || []).sort((a, b) => b.page - a.page);



  // Update user progress
  const updateProgress = () => {
    fetch('https://powerbroker.onrender.com/api/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, page: parseInt(page, 10) }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update progress');
            }
            return response.json();
        })
        .then((data) => {
            alert(`Progress updated for ${data.user}: ${data.page} pages`);
            setProgress((prev) => {
                const updatedProgress = prev.filter((p) => p.user !== data.user);
                return [...updatedProgress, data];
            });
        })
        .catch((error) => {
            console.error('Error updating progress:', error);
            alert('Error updating progress');
        });
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
            {sortedProgress.map((entry, index) => (
                <li key={index}>
                    {entry.user}: {entry.page} pages
                </li>
            ))}
        </ul>
    </div>
  );
}

export default App;
