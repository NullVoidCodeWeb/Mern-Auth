import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const history = useHistory();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation (basic check for non-empty)
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
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
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        ...formData,
        recaptchaToken: captchaValue,
      });
      localStorage.setItem("token", response.data.token);
      history.push("/users");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during login");
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
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;