import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/LoginInput.css';

const LoginInput = ({ login }) => {
  const [email, setEmail] = useState('');
  const [geslo, setGeslo] = useState(''); // Use 'geslo' for the password

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, geslo }); // Send 'geslo' instead of 'password'
  };

  return (
    <form className="login-input" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="geslo">Geslo:</label> {/* Use 'geslo' for the label */}
        <input
          type="password"
          id="geslo"
          value={geslo}
          onChange={(e) => setGeslo(e.target.value)}
          required
        />
      </div>
      <button type="submit">Prijava</button>
    </form>
  );
};

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginInput;
