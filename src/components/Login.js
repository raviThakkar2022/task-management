import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function LoginForm() {
    const [username, setUsernameEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          // Make a GET request to the JSON server to check if the user is registered
          const response = await axios.get(`http://localhost:3001/users?username=${username}&password=${password}`);
    
          if (response.data.length > 0) {
            // User is registered, perform login logic
            setLoginError(false);
            // Redirect to the Dashboard page or perform other actions
            window.location.href = '/dashboard';
          } else {
            // User is not registered
            setLoginError(true);
          }
        } catch (error) {
          // Handle any errors and display the error message
          setLoginError(true);
        }
      };

  return (
    <div className="login-form-container">
      <h2>Login Form</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Username:
          <input className="login-input" type="text" value={username} onChange={(e) => setUsernameEmail(e.target.value)} required />
        </label>
        <br />
        <label className="login-label">
          Password:
          <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        {loginError && <p className="login-error">Invalid username/email, password. Please try again.</p>}
        <br />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
