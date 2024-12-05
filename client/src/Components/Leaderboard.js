import React, { useEffect, useState } from 'react';
import Moses from '../mosesnew.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././custom.css'
import { Link } from 'react-router-dom';
import styles from '.././login.module.css'
import Crown from '../crownnew.png'
import Mick from '../mickey.png'
import Loser from '../last.png'

function Leaderboard() {
  const [progress, setProgress] = useState([]);
  const [page_number, setPage] = useState('');
  const connectionString = process.env.REACT_APP_CONNECTION_STRING;


  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    fetch(`${connectionString}/api/progress`, {
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
  }, [currentUser, connectionString]);

  const sortedProgress = (progress || []).sort((a, b) => b.page_number - a.page_number);

  const updateProgress = () => {
    fetch(`${connectionString}/api/progress`, {
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
      <div className="container my-0">
        <div className="row">
          <div className="col text-end"> 
            <img src={Moses} alt="Left" className="inverted-image" />
          </div>
          <div className="col text-center p-3">
            <h1 className="custom-header">The Power Broker</h1>
            <h2 className="power-rankings mt-4">Power Rankings</h2>
            <h2 className="date-today">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h2>
          </div>
          <div className="col text-start"> 
            <img src={Moses} alt="Right" className="" />
          </div>
        </div>
        <div className="row pt-3" style={{ marginLeft: "9rem", marginRight: "9rem" }}>
          <ul className="list-group custom-list-group">
            {sortedProgress.map((entry, index) => {
              const progress = Math.min((entry.page_number / 1162) * 100, 100); // Calculate progress percentage
              return (
                <li
                  key={index}
                  className="list-group-item d-flex align-items-center justify-content-between my-1 rounded bg-alternate"
                >
                  {/* Crown for First Place */}
                  {index === 0 && (
                    <img
                      src={Crown} // Replace with your crown image path
                      alt="Crown"
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-20px",
                        width: "50px",
                        height: "50px",
                        zIndex: 10,
                      }}
                    />
                  )}
                  {entry.username === 'Rich_KingOfNY' && (
                    <img
                      src={Mick} // Replace with your crown image path
                      alt="Crown"
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-20px",
                        width: "50px",
                        height: "50px",
                        zIndex: 10,
                      }}
                    />
                  )}
                  {index === sortedProgress.length - 1 && (
                    <img
                      src={Loser} // Replace with your crown image path
                      alt="Crown"
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-20px",
                        width: "50px",
                        height: "50px",
                        zIndex: 10,
                      }}
                    />
                  )}
                  {/* Progress Bar */}
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "180px", marginRight: "15px" }}
                  >
                    <div
                      className="progress"
                      style={{ width: "150px", height: "8px", marginRight: "5px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    {/* Percentage */}
                    <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: 'white'}}>
                      {Math.round(progress)}%
                    </span>
                  </div>

                  {/* Username */}
                  <Link
                    to={`/user/${entry.username}`}
                    className="text-decoration-none leader-entry"
                    style={{ textAlign: "center", flexGrow: "1" }}
                  >
                    {entry.username}
                  </Link>

                  {/* Page Number */}
                  <span
                    className="leader-entry"
                    style={{ marginLeft: "auto", fontWeight: "bold" }}
                  >
                    {entry.page_number} pages
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Update Progress Section */}
        <div className="mb-4">
          <div className="row g-2 py-4 px-5">
            <div className=" d-flex">
              <button
                className={`${styles['button-74']} d-flex align-items-center`}
                onClick={updateProgress}
                style={{ width: '100%', padding: '10px 15px', position: 'relative' }}
              >
                <input
                  type="number"
                  className="form-control"
                  placeholder="Page Number"
                  value={page_number}
                  onChange={(e) => setPage(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevents input click from triggering button
                  style={{
                    border: 'none',
                    flex: '1',
                    height: '100%',
                    margin: '0',
                    padding: '5px 10px',
                    fontSize: '1rem',
                  }}
                />
                <span style={{ marginLeft: '10px', whiteSpace: 'nowrap' }}>
                  Update Progress
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Leaderboard;
