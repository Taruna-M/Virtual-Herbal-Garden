import React, { useState, useRef, useEffect } from 'react';
import './login.css'; 

const LoginPage = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate login logic
    setFadeOut(true);
        alert('Login Successful')
  
        // Wait for the fade-out animation to finish, then call onLogin
        setTimeout(() => {
          onLogin();
        }, 500); // Match the duration of the fade-out transition

    // Trigger Unity animation if it's loade
  };

  return (
    <div>
        <div className={`login-container ${fadeOut ? 'fade-out' : ''}`}>
        <form className="login-form">
          <h2>Login</h2>
          <div className="input-container">
            <label>Username: </label>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleSubmit}>Login</button>
        </form>
      </div>
      
    </div>
  );
};

export default LoginPage;
