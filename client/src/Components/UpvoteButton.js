import '.././custom.css'

function UpvoteButton({ message_id, username, onVote }) {
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL
  const handleUpvote = async () => {
    try {
      const response = await fetch(`${connectionString}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id,
          username,
          vote_type: 'upvote', // Always "upvote"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error during upvote:', errorData);
        alert('Failed to upvote.');
      } else {
        const data = await response.json();
        console.log('Upvote successful:', data);
        if (onVote) onVote(); // Call onVote to refresh vote count
      }
    } catch (error) {
      console.error('Error during upvote:', error);
      alert('An error occurred while upvoting.');
    }
  };

  return (
    <button
      onClick={handleUpvote}
      style={{
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: 'blue',
      }}
      title="Upvote"
      className='button-74'
    >
      ↑
    </button>
  );
}

export default UpvoteButton;
