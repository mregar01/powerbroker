import React, { useState, useEffect } from 'react';
import '.././custom.css';
import { useParams } from 'react-router-dom';

const Quote = () => {
  const { username } = useParams();
  const [quotes, setQuotes] = useState([]); // State to hold the list of quotes
  const [newQuote, setNewQuote] = useState(''); // State to hold the new quote input
  const [newAuthor, setNewAuthor] = useState(''); // State to hold the new author input
  const [newPage, setNewPage] = useState(''); // State to hold the new page number input
  const [editingQuoteId, setEditingQuoteId] = useState(null); // Tracks which quote is being edited
  const [updatedQuote, setUpdatedQuote] = useState(''); // State to hold updated quote text
  const [updatedAuthor, setUpdatedAuthor] = useState(''); // State to hold updated author text
  const [updatedPage, setUpdatedPage] = useState(''); // State to hold updated page number
  const [isEditing, setIsEditing] = useState(false); // Tracks whether we're in "editing" mode
  const [error, setError] = useState(null); // State to hold any errors
  const connectionString = process.env.REACT_APP_CONNECTION_STRING;
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}; // Retrieve the current user safely

  // Fetch quotes when the component mounts or username changes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`${connectionString}/api/quote?username=${username}`, {
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

    fetchQuotes();
  }, [username, connectionString]);

  const handleAddQuote = async () => {
    try {
      const response = await fetch(`${connectionString}/api/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser?.username,
          quote: newQuote,
          author: newAuthor,
          page_number: newPage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error adding quote: ${response.statusText}`);
      }

      const addedQuote = await response.json();
      setQuotes((prevQuotes) => [...prevQuotes, addedQuote]); // Update quotes with the new quote
      setNewQuote('');
      setNewAuthor('');
      setNewPage('');
    } catch (error) {
      alert(`Failed to add quote: ${error.message}`);
    }
  };

  const handleDeleteQuote = async (id) => {
    try {
      const response = await fetch(`${connectionString}/api/deleteQuote`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting quote: ${response.statusText}`);
      }

      setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
    } catch (error) {
      alert(`Failed to delete quote: ${error.message}`);
    }
  };

  const handleEditQuoteSubmit = async () => {
    try {
      const response = await fetch(`${connectionString}/api/editQuote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingQuoteId,
          quote: updatedQuote,
          author: updatedAuthor,
          page_number: updatedPage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error editing quote: ${response.statusText}`);
      }

      const editedQuote = await response.json();
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) => (quote.id === editingQuoteId ? editedQuote : quote))
      );
      setEditingQuoteId(null);
      setUpdatedQuote('');
      setUpdatedAuthor('');
      setUpdatedPage('');
    } catch (error) {
      alert(`Failed to edit quote: ${error.message}`);
    }
  };

    if (username !== currentUser?.username) {
        return (
        <div>
          <h1 className='quote-header text-center'>My Quotes</h1>
          {error ? (
            <p></p>
          ) : (
            <ul className='quote-container'>
              {Array.isArray(quotes) &&
                quotes.map((quote) => (
                  <li className='quote-list' key={quote.id}>
                    <p>"{quote.quote}"</p>
                    <p>Author: {quote.author}</p>
                    <p>Page: {quote.page_number}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>)
      }

  return (
    <div>
      <h1 className='quote-header text-center'>My Quotes</h1>

      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <ul className='quote-container'>
          {Array.isArray(quotes) &&
            quotes.map((quote) => (
              <li className='quote-list' key={quote.id}>
                {editingQuoteId === quote.id ? (
                  <div>
                    <input
                      type="text"
                      value={updatedQuote}
                      onChange={(e) => setUpdatedQuote(e.target.value)}
                      placeholder="Edit quote"
                      className='input mx-4'
                    />
                    <input
                      type="text"
                      value={updatedAuthor}
                      onChange={(e) => setUpdatedAuthor(e.target.value)}
                      placeholder="Edit author"
                      className='input'
                    />
                    <input
                      type="number"
                      value={updatedPage}
                      onChange={(e) => setUpdatedPage(e.target.value)}
                      placeholder="Edit page number"
                      className='input mx-4'
                    />
                    <button className='button-74 mx-2 my-2' onClick={handleEditQuoteSubmit}>Submit</button>
                    <button className='button-74 my-2' onClick={() => setEditingQuoteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p>"{quote.quote}"</p>
                    <p>Author: {quote.author}</p>
                    <p>Page: {quote.page_number}</p>
                    <button
                      className='button-74 mx-2'
                      onClick={() => handleDeleteQuote(quote.id)}
                    >
                      Delete
                    </button>
                    <button
                      className='button-74'
                      onClick={() => {
                        setEditingQuoteId(quote.id);
                        setUpdatedQuote(quote.quote);
                        setUpdatedAuthor(quote.author);
                        setUpdatedPage(quote.page_number);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}

      {isEditing ? (
        <div>
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="Enter quote"
            className='mx-4 input'
          />
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Enter author"
            className='input'
          />
          <input
            type="number"
            value={newPage}
            onChange={(e) => setNewPage(e.target.value)}
            placeholder="Enter page number"
            className='mx-4 input'
          />
          <button className='button-74 mx-2 my-2' onClick={handleAddQuote}>Add Quote</button>
          <button className='button-74 my-2' onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <button className='button-74' onClick={() => setIsEditing(true)}>Add a Quote</button>
        </div>
      )}
    </div>
  );
};

export default Quote;
