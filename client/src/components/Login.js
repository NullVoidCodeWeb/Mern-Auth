import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) return alert("Please verify you are human.");
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        ...formData,
        recaptchaToken: captchaValue
      });
      localStorage.setItem('token', response.data.token);
      history.push('/users');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3">
            <ReCAPTCHA
              // v2
               sitekey="6LcpfVEqAAAAAFb9JhBUz4PGzefHp7cMQHI3eJtR"
              //v3
              // sitekey="6LfrflEqAAAAAMiEgeG2lGKot3dzaU2uLrWEiOnJ"
              onChange={setCaptchaValue}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;