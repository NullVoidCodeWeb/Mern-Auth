import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const history = useHistory();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error for the field being edited
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!captchaValue) {
      alert("Please verify you are human.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        ...formData,
        recaptchaToken: captchaValue,
      });
      if (response && response.data) {
        alert("Registration successful!");
        history.push("/");
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Registration failed");
      } else {
        alert("An error occurred during registration");
      }
      console.error("Registration error:", error);
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
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6Lfa4FMqAAAAABwqguta4JsNLerk77Mykal_d9bm"
              onChange={setCaptchaValue}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;