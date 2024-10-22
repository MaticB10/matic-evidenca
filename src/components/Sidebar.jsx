// Sidebar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext'; 
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 

  const handleLogout = () => {
    const confirmLogout = window.confirm("Ali ste prepričani, da se želite odjaviti?");
    if (confirmLogout) {
      logout();
      window.location.reload(); 
    }
  };

  const getRoleDisplayName = (role) => {
    if (!role) return 'Uporabnik';

    switch (role.toLowerCase()) {
      case 'user':
        return 'Uporabnik';
      case 'admin':
        return 'Delovec';
      case 'superadmin':
        return 'Lastnik';
      default:
        return 'Uporabnik';
    }
  };

  const isUser = user?.role?.toLowerCase() === 'user';
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';

  return (
    <Navbar bg="light" expand="lg" className="d-flex flex-column sidebar" collapseOnSelect>
      <div className="text-center my-4">
        <div className="logo-container" style={{ backgroundColor: '#007bff', borderRadius: '50%', padding: '10px' }}>
          <i className="bi bi-person-circle" style={{ fontSize: '60px', color: '#fff' }}></i>
        </div>
        <h4 className="mt-2">{`${user?.last_name || ''} ${user?.first_name || ''}`}</h4>
        <span className="text-muted">{getRoleDisplayName(user?.role)}</span>
      </div>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="flex-column w-100">
        <Nav className="flex-column w-100 px-4">
          <h6 className="text-muted text-uppercase">Navigations</h6>
          <Nav.Link as={Link} to="/">
            <i className="bi bi-house-door"></i> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/layouts">
            <i className="bi bi-pencil"></i> Layouts
          </Nav.Link>
          <h6 className="text-muted text-uppercase mt-4">Features</h6>
          <Nav.Link as={Link} to="/calendar">
            <i className="bi bi-calendar"></i> Calendar
          </Nav.Link>
          <Nav.Link as={Link} to="/dela">
            <i className="bi bi-card-text"></i> Dela
          </Nav.Link>
          {/* Prikaz "Shramba" samo za Admin in SuperAdmin */}
          {(isAdmin || isSuperAdmin) && (
            <Nav.Link as={Link} to="/shramba">
              <i className="bi bi-table"></i> Shramba
            </Nav.Link>
          )}
          {/* Prikaz "Grafi Dela" samo za SuperAdmin */}
          {isSuperAdmin && (
            <Nav.Link as={Link} to="/graphs">
              <i className="bi bi-bar-chart"></i> Grafi Dela
            </Nav.Link>
          )}

          <h6 className="text-muted text-uppercase mt-4">Extras</h6>
          <Nav.Link as={Link} to="/changepassword">
            <i className="bi bi-receipt"></i> Sprememba Gesla
          </Nav.Link>
          <Nav.Link onClick={handleLogout}>
            <i className="bi bi-box-arrow-in-right"></i> Odjavi
          </Nav.Link>
        </Nav>

        <div className="text-center social-icons my-4">
          <a href="#" className="mx-2"><i className="bi bi-facebook"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-twitter"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-linkedin"></i></a>
          <a href="#" className="mx-2"><i className="bi bi-instagram"></i></a>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Sidebar;
