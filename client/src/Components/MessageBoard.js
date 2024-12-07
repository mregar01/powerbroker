import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././custom.css';
import { Link } from 'react-router-dom';

function MessageBoard() {
  const [messages, setMessages] = useState([]); // Stores all messages
  const [newMessage, setNewMessage] = useState(''); // Tracks the new message being written
  const [newImageUrl, setNewImageUrl] = useState(''); // Tracks the new image URL
  const [error, setError] = useState(null); // Tracks any error
  const [loading, setLoading] = useState(true); // Loading state for fetching messages
  const [menuOpen, setMenuOpen] = useState(false); // Tracks menu visibility
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${connectionString}/api/user?username=${encodeURIComponent(currentUser.username)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data); // Store the user data in state
        setLoading(false); // Update loading state
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setLoading(false); // Update loading state
      }
    };

    fetchUserData();
  }, [connectionString, currentUser.username]);

  // Fetch all messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`${connectionString}/api/message`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data); // Set the messages state
      setLoading(false); // Stop loading
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      setLoading(false); // Stop loading in case of error
    }
  }, [connectionString]); // Dependency: connectionString

  // Post a new message
  const sendMessage = async () => {
    if (!newMessage.trim() && !newImageUrl.trim()) return; // Prevent sending empty messages or links

    try {
      const response = await fetch(`${connectionString}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: currentUser.username, 
          message: newMessage, 
          image_link: newImageUrl // Include the image URL
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post message: ${response.status}`);
      }

      setNewMessage(''); // Clear the message input
      setNewImageUrl(''); // Clear the image URL input
      fetchMessages(); // Refresh messages after posting
    } catch (err) {
      console.error('Error posting message:', err);
      setError(err.message);
    }
  };

  // Toggle the menu visibility
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Initial fetch of messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // Add fetchMessages as a dependency

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      {/* Menu Button */}
      <div className="text-end">
        <button className="button-74" onClick={toggleMenu}>
          Menu
        </button>
        {menuOpen && (
          <div className="menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to={`/user/${currentUser?.username}`} className="menu-link">
                  My Profile
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/leaderboard" className="menu-link">
                  Leaderboard
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/message" className="menu-link">
                  Message Board
                </Link>
              </li>
            </ul>

          </div>
        )}
      </div>


      <h2 className="text-center mb-4 custom-header">The Message Board</h2>

      {/* Message Input */}
      <div className="mb-4">
        <textarea
          className="form-control mb-2"
          placeholder="Write your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows="3"
        ></textarea>
        <input
          type="url"
          className="form-control mb-2"
          placeholder="Add an image URL (optional)..."
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button className="button-74 w-100" onClick={sendMessage}>
          Send Message
        </button>
      </div>

      {/* Messages List */}
      <div className="list-group">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="message-item">
              <p>
                <img 
                  src={userData?.profile_picture} 
                  alt={`${userData?.bio}`}
                  style={{
                    width: "30px",
                    height: "30px",
                    zIndex: 10,
                  }}
                />
                <strong className="ps-2 text-black">{msg.username}: </strong> 
                <br />
                <span className='text-black'>{msg.message}</span>
                <br />
                {msg.image_link && (
                  <img 
                    src={msg.image_link} 
                    alt="User provided" 
                    style={{
                      width: "400px",
                      height: "200px",
                      objectFit: "cover",
                      marginTop: "10px",
                      borderRadius: "5px"
                    }}
                  />
                )} 
              </p>
              <small className="text-muted">Posted on: {new Date(msg.created_at).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p className="text-center">No messages yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
}

export default MessageBoard;
