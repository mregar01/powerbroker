// Components/Register.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from '.././login.module.css'

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const connectionString = process.env.REACT_APP_CONNECTION_STRING;

  const handleRegister = () => {
    fetch(`${connectionString}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error during registration');
        }
        return response.json();
      })
      .then((data) => {
        const decodedToken = jwtDecode(data.token);
        const usernameFromToken = decodedToken.username;

        localStorage.setItem(
          'currentUser',
          JSON.stringify({ token: data.token, username: usernameFromToken })
        );
        navigate('/leaderboard');
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred');
      });
  };

  return (
    <div className={`${styles.container} container py-2 cream-background`}>
      <h1 className="custom-header">The Power Broker</h1>
      <h1 className={styles.login}>Register</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <button className={styles['button-74']} onClick={handleRegister}>
          Register
        </button>
        <button
          className={styles['button-74']}
          onClick={() => navigate('/')}
        >
          Switch to Login
        </button>
      </div>
    </div>
  );
}

export default Register;
