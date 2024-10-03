import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const { token } = useParams();
  const history = useHistory();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        console.log('API URL:', apiUrl); // For debugging
        const response = await axios.get(`${apiUrl}/api/auth/verify/${token}`);

        setVerificationStatus(response.data.message);
        setTimeout(() => history.push('/'), 1500);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, history]);

  return (
    <div className="container mt-5">
      <div className="alert alert-info">{verificationStatus}</div>
    </div>
  );
}

export default VerifyEmail;