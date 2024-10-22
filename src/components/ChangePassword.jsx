import React, { useState, useEffect, useContext } from 'react';
import '../styles/ChangePassword.css';
import { AuthContext } from '../contexts/AuthContext';

function ChangePassword() {
  const { user } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');

  useEffect(() => {
    if (user && (user.rank === 'Super Admin' || user.rank === 'Admin')) {
      fetch('http://localhost:8081/uporabniki')
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            setUsers(data);
            if (data.length > 0) {
              setSelectedUserEmail(data[0].email);
            }
          }
        })
        .catch(err => console.error('Failed to fetch users:', err));
    }
  }, [user]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUserEmail(event.target.value);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return `Geslo mora biti dolgo najmanj ${minLength} znakov.`;
    }
    if (!hasUpperCase) {
      return 'Geslo mora vsebovati vsaj eno veliko črko.';
    }
    if (!hasLowerCase) {
      return 'Geslo mora vsebovati vsaj eno malo črko.';
    }
    if (!hasNumber) {
      return 'Geslo mora vsebovati vsaj eno številko.';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg('Gesli se ne ujemata.');
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: selectedUserEmail, password }), // Use the selected user's email
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMsg('Geslo je bilo uspešno spremenjeno.');
        setErrorMsg('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(result.message || 'Prišlo je do napake pri spremembi gesla.');
      }
    } catch (error) {
      setErrorMsg('Prišlo je do napake pri povezovanju s strežnikom.');
    }
  };

  return (
    <div className="change-password">
      <h2>Novo geslo</h2>
      <p>
        Za dostop do spletnega uporabniškega vmesnika si lahko izberete fiksno, poljubno geslo.
        Uporabite ga lahko namesto spreminjajočega PIN-a.
      </p>
      <p>
        Geslo mora biti dolgo najmanj 8 znakov, vsebovati mora vsaj eno <strong>veliko</strong> črko,
        vsaj eno <strong>malo</strong> črko in vsaj eno <strong>številko</strong>.
      </p>
      <p>
        Kljub nastavitvi gesla, bo še vedno mogoča prijava s PIN-om.
      </p>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {user && (user.rank === 'Super Admin' || user.rank === 'Admin') && (
        <div className="form-group">
          <label htmlFor="userSelect">Izberi uporabnika:</label>
          <select
            id="userSelect"
            value={selectedUserEmail}
            onChange={handleUserChange}
          >
            {users.map((u) => (
              <option key={u.id} value={u.email}>
                {u.ime} {u.priimek} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Novo geslo</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Potrdi geslo</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Nastavi</button>
      </form>
    </div>
  );
}

export default ChangePassword;
