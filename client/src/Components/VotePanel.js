import React, { useState, useEffect, useCallback } from 'react';
import UpvoteButton from './UpvoteButton';
import DownvoteButton from './DownVoteButton';
import '.././custom.css'

function VotePanel({ message_id, username }) {
  const connectionString = process.env.REACT_APP_CONNECTION_STRING; // API base URL
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the vote count
  const fetchVoteCount = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true during fetch
      const response = await fetch(`${connectionString}/api/vote?message_id=${message_id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vote count');
      }

      const data = await response.json();
      setVoteCount(data.vote_count || 0); // Default to 0 if no vote count is returned
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vote count:', err);
      setError('Could not fetch vote count');
      setLoading(false);
    }
  }, [connectionString, message_id]); // Add dependencies here

  // Fetch the vote count when the component loads
  useEffect(() => {
    fetchVoteCount();
  }, [fetchVoteCount]); // Now fetchVoteCount is in the dependency array

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Upvote Button */}
      <UpvoteButton message_id={message_id} username={username} onVote={fetchVoteCount} />

      {/* Vote Count */}
      {loading ? (
        <p style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: 'black' }}>{voteCount}</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: 'black' }}>{voteCount}</p>
      )}

      {/* Downvote Button */}
      <DownvoteButton message_id={message_id} username={username} onVote={fetchVoteCount} />
    </div>
  );
}

export default VotePanel;
