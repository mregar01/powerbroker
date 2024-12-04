import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././custom.css';
import { useNavigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';



function LoginRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = () => {
    const endpoint = isRegistering
      ? 'https://powerbroker.onrender.com/api/register'
      : 'https://powerbroker.onrender.com/api/login';

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error during login/register');
        }
        return response.json();
      })
      .then((data) => {
        alert(isRegistering ? 'Registration successful!' : 'Login successful!');
        // Handle storing tokens or redirecting to leaderboard

        const decodedToken = jwtDecode(data.token);
      const usernameFromToken = decodedToken.username;

      // Store username and token in localStorage
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ token: data.token, username: usernameFromToken })
      );

        // Redirect to leaderboard
        navigate('/leaderboard');
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred');
      });
  };

  return (
    <div className="container py-5">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
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
        <button className="btn btn-primary" onClick={handleSubmit}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
}

export default LoginRegister;
