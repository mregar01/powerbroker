import React, { useState } from 'react';
import '.././custom.css'
import Menu from './Menu';



const MosesBot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL
  const [menuOpen, setMenuOpen] = useState(false); // Tracks menu visibility
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  

  const handleSendMessage = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${connectionString}/api/bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse({ message: data.responseMessage });
      
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setResponse(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div>
      <div className="text-end">
          <button className="button-74" onClick={toggleMenu}>
            Menu
          </button>
          {menuOpen && <Menu currentUser={currentUser} />}
        </div>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        {/* Menu Button */}
        {response ? (
          <div>
            {response.error ? (
              <p style={{ color: 'red' }}>{response.error}</p>
            ) : (
              <div>
                <h1 className='custom-header py-4'>MosesBot</h1>
                <h2 className='power-rankings pb-3'>The Wise Moses Says...</h2>
                <p className=''>{response.message}</p>
              </div>
            )}
            <button className='button-74' onClick={handleReset}>Ask Another Question</button>
          </div>
        ) : (
          <div>
            <h1 className='custom-header py-4'>MosesBot</h1>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{ padding: '10px', width: '100%', height: '80px' }}
              className='input my-2'
            />
            <button className='button-74 my-3' onClick={handleSendMessage} disabled={isLoading} style={{ marginLeft: '10px', padding: '10px' }}>
              Send Message to Moses Bot
            </button>
            {isLoading && <p>Loading...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MosesBot;
