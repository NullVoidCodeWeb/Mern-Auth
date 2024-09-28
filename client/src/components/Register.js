import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) return alert("Please verify you are human.");
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        recaptchaToken: captchaValue
      });
      alert("Registration successful!");
      history.push('/');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="username"
              className="form-control"
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
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
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;