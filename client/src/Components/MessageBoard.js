import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././custom.css';
import Menu from './Menu';
import VotePanel from './VotePanel';

function MessageBoard() {
  const [messages, setMessages] = useState([]); // Stores all messages
  const [userPictures, setUserPictures] = useState({}); // Maps usernames to their profile pictures
  const [newMessage, setNewMessage] = useState(''); // Tracks the new message being written
  const [newImageUrl, setNewImageUrl] = useState(''); // Tracks the new image URL
  const [error, setError] = useState(null); // Tracks any error
  const [loading, setLoading] = useState(true); // Loading state for fetching messages
  const [menuOpen, setMenuOpen] = useState(false); // Tracks menu visibility
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

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

  // Fetch profile picture for a given username
  const fetchProfilePicture = useCallback(async (username) => {
    if (userPictures[username]) return; // If already fetched, skip
    try {
      const response = await fetch(`${connectionString}/api/user?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile picture for ${username}: ${response.status}`);
      }

      const data = await response.json();
      setUserPictures((prev) => ({ ...prev, [username]: data.profile_picture })); // Store the profile picture
    } catch (err) {
      console.error(`Error fetching profile picture for ${username}:`, err);
    }
  }, [connectionString, userPictures]); // Dependencies: connectionString and userPictures

  // Fetch profile pictures for all users in messages
  useEffect(() => {
    const uniqueUsernames = [...new Set(messages.map((msg) => msg.username))]; // Get unique usernames
    uniqueUsernames.forEach((username) => fetchProfilePicture(username)); // Fetch profile pictures
  }, [messages, fetchProfilePicture]); // Re-run when messages change

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

  if (!currentUser) {
    return (
      <div className="container mt-4 text-center">
        <h2 className="text-muted">Please log in to use the message board.</h2>
        <button className="button-74" onClick={toggleMenu}>
          Menu
        </button>
        {menuOpen && <Menu currentUser={currentUser} />}
      </div>
    );
  }

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
        {menuOpen && <Menu currentUser={currentUser} />}
      </div>

      <h2 className="text-center mb-4 custom-header">The Message Board</h2>

      {/* Conditionally Render Message Input Form */}
      {currentUser ? (
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
      ) : (
        <p className="text-center text-muted">
          Please log in to post a message.
        </p>
      )}

      {/* Messages List */}
      <div className="list-group">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="message-item" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
              {/* VotePanel */}
              <div style={{ marginRight: '10px' }}>
                <VotePanel message_id={msg.id} username={currentUser.username} />
              </div>

              {/* Message Content */}
              <div>
                <p style={{ margin: 0 }}>
                  <img 
                    src={userPictures[msg.username] || 'https://via.placeholder.com/30'} // Display fetched profile picture or placeholder
                    alt={`${msg.username}'s profile`}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%", // Make it circular
                      objectFit: "cover",
                      zIndex: 10,
                      marginRight: "10px", // Add spacing between profile picture and username
                      verticalAlign: "middle",
                    }}
                  />
                  <strong className="text-black">{msg.username}: </strong>
                </p>
                <p style={{ marginTop: "5px" }}>
                  <span className="text-black">{msg.message}</span>
                </p>
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
                <br></br>
                <small className="text-muted">Posted on: {new Date(msg.created_at).toLocaleString()}</small>
              </div>
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