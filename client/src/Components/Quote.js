import React, { useState, useEffect } from 'react';
import '.././custom.css';

const Quote = () => {
  const [quotes, setQuotes] = useState([]); // State to hold the list of quotes
  const [newQuote, setNewQuote] = useState(''); // State to hold the new quote input
  const [isAdding, setIsAdding] = useState(false); // Tracks whether we're in "adding" mode
  const [error, setError] = useState(null); // State to hold any errors
  const connectionString = process.env.REACT_APP_CONNECTION_STRING;
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}; // Retrieve the current user safely

  // Fetch quotes when the component mounts or username changes
  useEffect(() => {
    const fetchQuotes = async () => {

      if (!currentUser?.username) return;
      try {
        const response = await fetch(`${connectionString}/api/user?username=${currentUser.username}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Error fetching quotes: ${response.statusText}`);
        }

        const data = await response.json();
        setQuotes(data.quotes || []); // Ensure quotes is an array
      } catch (err) {
        setError(err.message);
      }
    };

    if (currentUser.username) {
      fetchQuotes();
    }
  }, [currentUser.username, connectionString]);

  const handleAddClick = () => {
    setIsAdding(true); // Show the input field and submit button
  };

  const handleCancelClick = () => {
    setIsAdding(false); // Go back to the "Add New Quote" button
    setNewQuote(''); // Clear the input field
  };

  const handleInputChange = (event) => {
    setNewQuote(event.target.value); // Update the new quote as the user types
  };

  const handleSubmitClick = async () => {
    try {
      const response = await fetch(`${connectionString}/api/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser.username,
          quote: newQuote,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error submitting quote: ${response.statusText}`);
      }

      const addedQuote = await response.json();
      console.log(addedQuote)
      setQuotes((prevQuotes) => [...prevQuotes, addedQuote]); // Update quotes with the new quote
      setIsAdding(false); // Return to "Add New Quote" button
      setNewQuote(''); // Clear the input field
    } catch (error) {
      alert(`Failed to add quote: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 className='quote-header text-center'>My Quotes</h1>

      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <ul className='quote-container'>
          {Array.isArray(quotes) && quotes.map((quote, index) => (
            <li className='quote-list' key={index}>
              "{quote}"
            </li>
          ))}
        </ul>
      )}

      <div className='pb-3'>
        {isAdding ? (
          <div>
            <input
              type="text"
              value={newQuote}
              onChange={handleInputChange}
              placeholder="Enter your quote"
            />
            <button className='button-74 mx-2' onClick={handleSubmitClick}>Submit</button>
            <button className='button-74' onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <button className='button-74' onClick={handleAddClick}>Add New Quote</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quote;
