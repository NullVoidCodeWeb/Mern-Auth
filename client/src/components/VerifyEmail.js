import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const history = useHistory();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`);
        setMessage(response.data.message);
        setTimeout(() => history.push('/login'), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred during email verification');
      }
    };

    verifyEmail();
  }, [token, history]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;