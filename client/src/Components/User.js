import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function User() {
  const { username } = useParams(); // Extract the username from the URL
  const [userData, setUserData] = useState(null); // Store user data
  const [error, setError] = useState(null); // Store error message
  const [loading, setLoading] = useState(true); // Store loading state
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [formData, setFormData] = useState({}); // Form data for editing
  const connectionString = process.env.REACT_APP_CONNECTION_STRING;
  const navigate = useNavigate();

  // Retrieve the currently logged-in user's username from local storage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))?.username;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${connectionString}/api/user?username=${encodeURIComponent(username)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data); // Set the fetched user data
        setFormData(data); // Initialize the form data
        setLoading(false); // Set loading to false
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchUserData();
  }, [username, connectionString]);

  const handleEditToggle = () => setEditMode(!editMode); // Toggle edit mode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form data
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${connectionString}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, username }), // Include username
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedData = await response.json();
      setUserData(updatedData); // Update user data
      setEditMode(false); // Exit edit mode
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
    }
  };

  const calculatePagesPerDay = (pageNumber) => {
    const startDate = new Date('2024-12-02'); // Starting day
    const currentDate = new Date(); // Current day
    const daysElapsed = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24)); // Days between
    return (pageNumber / daysElapsed).toFixed(2); // Average pages per day
  };

  const calculateFinishDate = (pageNumber) => {
    const pagesPerDay = calculatePagesPerDay(pageNumber);
    const daysToFinish = Math.floor(1162 / pagesPerDay);
    const currentDate = new Date();
    const finishDate = new Date(currentDate);
    finishDate.setDate(currentDate.getDate() + daysToFinish);
    return finishDate;

  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className='custom-header'>{userData.username}</h1>
      {editMode && currentUser === username ? (
        <>
          <div className="form-container" style={{ width: '80%', margin: '0 auto' }}>
            <label className="d-block mb-3">
              Bio:
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-control"
                style={{ width: '100%', height: '150px' }} // Wider and taller textarea
              />
            </label>
            <label className="d-block mb-3">
              Height:
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleInputChange}
                className="form-control"
                style={{ width: '100%' }} // Stretch input width
              />
            </label>
            <label className="d-block mb-3">
              Weight:
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                className="form-control"
                style={{ width: '100%' }} // Stretch input width
              />
            </label>
            <label className="d-block mb-3">
              Profile Picture:
              <input
                type="text"
                name="profile_picture"
                value={formData.profile_picture || ''}
                onChange={handleInputChange}
                className="form-control"
                style={{ width: '100%' }} // Stretch input width
              />
            </label>
            <div className="d-flex mt-3">
              <button className="button-74 me-3" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="button-74" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </div>
        </>

      ) : (
        <>
          <div className="profile-container p-4 shadow rounded bg-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="text-center mb-4 profile-name">{userData.username}'s Profile</h2>
            <div className="text-center mb-3">
              {userData.profile_picture ? (
                <img
                  src={userData.profile_picture}
                  alt={`${userData.username}'s profile`}
                  className="img-thumbnail rounded-circle"
                  style={{ maxWidth: '150px' }}
                />
              ) : (
                <p><strong>No profile picture available</strong></p>
              )}
            </div>
            <div className="mb-3">
              <p><strong>Bio:</strong> {userData.bio || 'No bio available'}</p>
            </div>
            <div className="row mb-3">
              <div className="col text-center">
                <p><strong>Height:</strong> {userData.height ? `${userData.height} inches` : 'N/A'}</p>
              </div>
              <div className="col text-center">
                <p><strong>Weight:</strong> {userData.weight ? `${userData.weight} lbs` : 'N/A'}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col text-center">
                <p><strong>Current Page:</strong> {userData.page_number || 'N/A'}</p>
              </div>
              <div className="col text-center">
                <p><strong>Pages/Day:</strong> {userData.page_number ? calculatePagesPerDay(userData.page_number) : 'N/A'}</p>
              </div>
            </div>
            <div className="row mb-3">
            <div className="col text-center">
              <p>
                <strong>Projected Finish Date: </strong> 
                {userData.page_number ? 
                  new Date(calculateFinishDate(userData.page_number)).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) 
                  : 'N/A'}
              </p>
            </div>
            </div>
            {currentUser === username && (
              <div className="text-center mb-3">
                <button className="button-74 w-100" onClick={handleEditToggle}>
                  Edit Profile
                </button>
              </div>
            )}
            <button
              className="button-74 w-100"
              onClick={() => navigate('/leaderboard')}
            >
              Go to Leaderboard
            </button>
          </div>
        </>

      )}
      
    </div>
  );
}

export default User;
