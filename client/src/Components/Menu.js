// Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

function Menu({ currentUser }) {
  if (!currentUser) {
    return (
      <div className="menu">
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/" className="menu-link text-black">
            Login
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/leaderboard" className="menu-link text-black">
            Leaderboard
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/message" className="menu-link text-black">
            Message Board
          </Link>
        </li>
      </ul>
    </div>
    );
  }
  return (
    <div className="menu">
      <ul className="menu-list">
        <li className="menu-item">
          <Link to={`/user/${currentUser?.username}`} className="menu-link text-black">
            My Profile
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/leaderboard" className="menu-link text-black">
            Leaderboard
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/message" className="menu-link text-black">
            Message Board
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
