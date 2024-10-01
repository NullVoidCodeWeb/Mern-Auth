import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// Use an environment variable for the API URL
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/');
          return;
        }
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
        // If the error is due to an invalid token, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/');
        }
      }
    };
    fetchUsers();
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registered Users</h2>
          {users.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <ul className="list-group">
                            {users.map(user => (
                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{user.username}</strong>
                    <span className="text-muted ms-3">{user.email}</span>
                  </div>
                  <span className="badge bg-primary rounded-pill">User ID: {user.id}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="text-center mt-4">
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;