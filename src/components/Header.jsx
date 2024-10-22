import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header d-flex align-items-center justify-content-between px-4 py-2">
      <div className="header-left d-flex align-items-center">
        <h1 className="logo"></h1>
      </div>



      <div className="header-right d-flex align-items-center">
        <div className="icons d-flex align-items-center mx-3">
          <FontAwesomeIcon icon={faEnvelope} className="icon mx-2" />
          <FontAwesomeIcon icon={faBell} className="icon mx-2" />
        </div>
      </div>
    </header>
  );
}

export default Header;
