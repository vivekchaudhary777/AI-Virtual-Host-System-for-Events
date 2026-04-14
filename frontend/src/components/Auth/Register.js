import React, { useState } from 'react';
import axios from '../../services/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RegContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
  font-family: 'Inter', sans-serif;
`;

const RegForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

  h2 {
    margin-bottom: 24px;
    text-align: center;
    font-weight: 700;
  }

  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #ff5e3a;
      }
    }
  }

  button {
    width: 100%;
    padding: 14px;
    background-color: #ff5e3a;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  .login-link {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
    span {
      color: #ff5e3a;
      cursor: pointer;
      font-weight: 600;
    }
  }
`;

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const payload = {
        ...userData,
        email: userData.email.toLowerCase(),
      };
      const response = await axios.post('/auth/register', payload);
      if (response && response.data) {
        alert('Registered successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      alert('Registration failed. ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <RegContainer>
      <RegForm>
        <h2>Join EventPlan</h2>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" onChange={handleInputChange} placeholder="Choose a username" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleInputChange} placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleInputChange} placeholder="Create a password" />
        </div>
        <div className="form-group">
          <label>I am a:</label>
          <select name="role" onChange={handleInputChange} value={userData.role}>
            <option value="user">Individual Attendee</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="button" onClick={handleRegister}>Sign Up</button>
        <div className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </div>
      </RegForm>
    </RegContainer>
  );
};

export default Register;
