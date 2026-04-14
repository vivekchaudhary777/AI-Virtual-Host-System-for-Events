import React, { useState } from 'react';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
  font-family: 'Inter', sans-serif;
`;

const LoginForm = styled.form`
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

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      outline: none;

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

    &:hover {
      opacity: 0.9;
    }
  }

  .register-link {
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

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const payload = {
        ...loginData,
        email: loginData.email.toLowerCase(),
      };
      
      const response = await axios.post('/auth/login', payload);
      const authData = {
        token: response.data.token,
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role,
        purchasedEvents: response.data.purchasedEvents || []
      };
      login(authData);
      
      // Redirect based on role
      if (authData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Check your credentials.';
      alert('Login failed: ' + errorMsg);
    }
  };

  return (
    <LoginContainer>
      <LoginForm>
        <h2>Welcome Back</h2>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleInputChange} placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleInputChange} placeholder="Enter your password" />
        </div>
        <button type="button" onClick={handleLogin}>Login</button>
        <div className="register-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </div>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
