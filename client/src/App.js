import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import Moses from './moses.png'


function App() {
  const [progress, setProgress] = useState([]);
  const [user, setUser] = useState('');
  const [page, setPage] = useState('');

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
        setProgress(data);
      })
      .catch((error) => {
        console.error('Error fetching progress:', error);
        setProgress([]);
      });
  }, []);

  const sortedProgress = (progress || []).sort((a, b) => b.page - a.page);

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
    <div className="container">
      <div className="grid-container">
        
        <img src={Moses} alt="Left" className="grid-image left inverted-image ms-auto" />

        <div className="grid-words">
            <h1 className="custom-header">The</h1>
            <h1 className="custom-header">Power</h1>
            <h1 className="custom-header">Broker</h1>
        </div>

        <img src={Moses} alt="Right" className="grid-image right" />

        <h2 className='power-rankings mt-0'>Power Rankings</h2>
        <h2 className="date-today">{new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
            })}
        </h2>
      </div>

      {/* Leaderboard Section */}
      <ul className="list-group">
        {sortedProgress.map((entry, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <span>{entry.user}</span>
            <span>{entry.page} pages</span>
          </li>
        ))}
      </ul>


      {/* Input Section */}
      <div className="mb-4">
        <div className="row g-2 py-4">
          <div className="col-sm-5">
            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="col-sm-5">
            <input
              type="number"
              className="form-control"
              placeholder="Page Number"
              value={page}
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

export default App;
