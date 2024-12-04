import React, { useEffect, useState } from 'react';
import Moses from '../moses.png';

function Leaderboard() {
  const [progress, setProgress] = useState([]);
  const [page_number, setPage] = useState('');

  const prodLink = 'https://powerbroker.onrender.com/api/progress';

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    fetch(prodLink, {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`, // Pass token for protected routes
      },
    })
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
        setProgress(data);
      })
      .catch((error) => {
        console.error('Error fetching progress:', error);
        setProgress([]);
      });
  }, [currentUser]);

  const sortedProgress = (progress || []).sort((a, b) => b.page_number - a.page_number);

  const updateProgress = () => {
    fetch(prodLink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`, // Pass token for authentication
      },
      body: JSON.stringify({ username: currentUser?.username, page_number: parseInt(page_number, 10) }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update progress');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Progress updated for ${data.username}: ${data.page_number} pages`);
        setProgress((prev) => {
          const updatedProgress = prev.filter((p) => p.username !== data.username);
          return [...updatedProgress, data];
        });
      })
      .catch((error) => {
        console.error('Error updating progress:', error.message || error);
        alert(`Error updating progress: ${error.message}`);
      });
      
  };

  return (
    <div className="container">
      {/* Grid for Leaderboard */}
      <div className="grid-container">
        <img src={Moses} alt="Left" className="grid-image left inverted-image ms-auto" />
        <div className="grid-words">
          <h1 className="custom-header">The</h1>
          <h1 className="custom-header">Power</h1>
          <h1 className="custom-header">Broker</h1>
        </div>
        <img src={Moses} alt="Right" className="grid-image right" />
        <h2 className="power-rankings mt-0">Power Rankings</h2>
        <h2 className="date-today">
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h2>
      </div>

      {/* Leaderboard */}
      <ul className="list-group">
        {sortedProgress.map((entry, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <span>{entry.username}</span>
            <span>{entry.page_number} pages</span>
          </li>
        ))}
      </ul>

      {/* Update Progress Section */}
      <div className="mb-4">
        <div className="row g-2 py-4">
          <div className="col-sm-5">
            <input
              type="number"
              className="form-control"
              placeholder="Page Number"
              value={page_number}
              onChange={(e) => setPage(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <button className="btn btn-primary w-100" onClick={updateProgress}>
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
