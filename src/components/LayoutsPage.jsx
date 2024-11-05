import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/LayoutsPage.css';

function LayoutsPage() {
  const { user } = useContext(AuthContext);
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    userId: '',
    modelId: ''
  });
  const [users, setUsers] = useState([]);
  const [userVehicles, setUserVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);

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

    // Fetch vehicle brands and models
    axios.get('https://evidenca-back-end.onrender.com/vehicle-brands')
      .then(response => {
        setBrands(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle brands:', error);
      });

    axios.get('https://evidenca-back-end.onrender.com/vehicle-models')
      .then(response => {
        setModels(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle models:', error);
      });
  }, [user.id, user.role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value;
    setVehicleData({ ...vehicleData, make: selectedBrandId, modelId: '' });
    setFilteredModels(models.filter(model => model.brand_id === parseInt(selectedBrandId)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      licensePlate: vehicleData.licensePlate,
      userId: vehicleData.userId || user.id,
      modelId: vehicleData.modelId
    };

    try {
      const response = await axios.post('https://evidenca-back-end.onrender.com/add-vehicle', formData);

      console.log('Vehicle successfully added:', response.data);
      alert('Vehicle successfully added.');
    } catch (error) {
      console.error('Error saving vehicle data:', error);
      alert('Error saving vehicle data.');
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Dodajanje in posodablanje vozila</h3>
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
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Vehicle Information</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="make">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      as="select"
                      name="make"
                      value={vehicleData.make}
                      onChange={handleBrandChange}
                    >
                      <option value="">Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="model" className="mt-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      as="select"
                      name="modelId"
                      value={vehicleData.modelId}
                      onChange={(e) => setVehicleData({ ...vehicleData, modelId: e.target.value })}
                    >
                      <option value="">Select a model</option>
                      {filteredModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.model_name}
                        </option>
                      ))}
                    </Form.Control>
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

                  <Button variant="primary" type="submit" className="mt-3">
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
