import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/LayoutsPage.css'; // Assuming you will add custom styles here

function LayoutsPage() {
  const { user } = useContext(AuthContext); 
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    userId: '' 
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [users, setUsers] = useState([]); 
  const [userVehicles, setUserVehicles] = useState([]); 

  useEffect(() => {
    if (user.role === 'superadmin') {
      axios.get('https://evidenca-back-end.onrender.com/users')
        .then(response => {
          if (!response.data.error) {
            setUsers(response.data.data);
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }

    axios.get(`https://evidenca-back-end.onrender.com/vehicles/${user.id}`)
      .then(response => {
        if (!response.data.error) {
          setUserVehicles(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching vehicles:', error);
      });
  }, [user.id, user.role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', vehicleData.make);
    formData.append('model', vehicleData.model);
    formData.append('year', vehicleData.year);
    formData.append('licensePlate', vehicleData.licensePlate);
    formData.append('userId', vehicleData.userId || user.id);

    selectedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      const response = await axios.post('https://evidenca-back-end.onrender.com/add-vehicle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Vehicle successfully added:', response.data);
      alert('Vehicle and images successfully added.');
    } catch (error) {
      console.error('Error saving vehicle data:', error);
      alert('Error saving vehicle data.');
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Form Elements</h3>
        </Col>
      </Row>

      {user.role === 'user' && (
        <Row>
          <Col>
            <h4>Your Vehicles</h4>
            <ul>
              {userVehicles.map((vehicle) => (
                <li key={vehicle.id}>{vehicle.make} {vehicle.model} - {vehicle.license_plate}</li>
              ))}
            </ul>
          </Col>
        </Row>
      )}

      {user.role === 'superadmin' && (
        <Row className="mt-4">
          {/* Form Section */}
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Vehicle Information</Card.Title>
                <Form>
                  <Form.Group controlId="make">
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter vehicle make"
                      name="make"
                      value={vehicleData.make}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="model" className="mt-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter vehicle model"
                      name="model"
                      value={vehicleData.model}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="year" className="mt-3">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter vehicle year"
                      name="year"
                      value={vehicleData.year}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="licensePlate" className="mt-3">
                    <Form.Label>License Plate</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter vehicle license plate"
                      name="licensePlate"
                      value={vehicleData.licensePlate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="userId" className="mt-3">
                    <Form.Label>Select User</Form.Label>
                    <Form.Control
                      as="select"
                      name="userId"
                      value={vehicleData.userId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a user</option>
                      {users.map((usr) => (
                        <option key={usr.id} value={usr.id}>
                          {usr.first_name} {usr.last_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* File Upload Section */}
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body className="file-upload-section">
                <Card.Title>Upload Images</Card.Title>
                <Form>
                  <Form.Group controlId="fileUpload">
                    <Form.Label>Upload vehicle images</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <div className="drag-drop-area">
                    <span>Select or Drop Files here</span>
                  </div>
                  <Button variant="primary" className="mt-3" onClick={handleSubmit}>
                    Save
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default LayoutsPage;
