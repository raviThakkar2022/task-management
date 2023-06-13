import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; 

function RegistrationForm() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Create a new user object from the form data
        const newUser = {
          name,
          username,
          email,
          contactNumber,
          password,
          profileImage,
        };

    try {
        // Make a POST request to the JSON server
        await axios.post('http://localhost:3001/users', newUser);
  
        // Reset the form and show the success message
        setName('');
        setUsername('');
        setEmail('');
        setContactNumber('');
        setPassword('');
        setProfileImage(null);
        setRegistrationError(null);
        setRegistrationSuccess(true);
      } catch (error) {
        // Handle any errors and display the error message
        setRegistrationSuccess(false);
        setRegistrationError(error.message);
      }
    };

  return (
    <div className="registration-form-container">
      <h2>Registration Form</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <label className="registration-label">
          Name: *
          <input className="registration-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <label className="registration-label">
          Username: *
          <input className="registration-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label className="registration-label">
          Email: *
          <input className="registration-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label className="registration-label">
          Contact Number:
          <input className="registration-input" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </label>
        <br />
        <label className="registration-label">
          Password: *
          <input className="registration-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label className="registration-label">
          Profile Image:
          <input className="registration-input" type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
        </label>
        <br />
        {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
        {registrationSuccess && <p style={{ color: 'green' }}>Registration successful!</p>}
        <button className="registration-button" type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
