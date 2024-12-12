import '.././custom.css'

function DownvoteButton({ message_id, username, onVote }) {
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL
  const handleDownvote = async () => {
    try {
      const response = await fetch(`${connectionString}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id,
          username,
          vote_type: 'downvote', // Always "downvote"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error during downvote:', errorData);
        alert('Failed to downvote.');
      } else {
        const data = await response.json();
        console.log('Downvote successful:', data);
        if (onVote) onVote(); // Call onVote to refresh vote count
      }
    } catch (error) {
      console.error('Error during downvote:', error);
      alert('An error occurred while downvoting.');
    }
  };

  return (
    <button
      onClick={handleDownvote}
      style={{
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: 'red',
      }}
      title="Downvote"
      className="button-74"
    >
      ↓
    </button>
  );
}

export default DownvoteButton;
