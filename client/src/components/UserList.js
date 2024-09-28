import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        history.push('/');
      }
    };
    fetchUsers();
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Registered Users</h2>
        <ul className="list-group">
          {users.map(user => (
            <li key={user.id} className="list-group-item">
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
      </div>
    </div>
  );
}

export default UserList;