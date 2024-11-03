import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Shramba() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Stanje za način urejanja
  const [editItemId, setEditItemId] = useState(null); // Stanje za ID artikla, ki ga urejamo
  const [newItem, setNewItem] = useState({
    item_name: '',
    category: '',
    quantity: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios.get('https://evidenca-back-end.onrender.com/inventory')
      .then(response => {
        if (!response.data.error) {
          setInventory(response.data.data);
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju podatkov iz inventory:', error);
      });
  };

  const handleAddNewItem = () => {
    if (isEditMode) {
      // Urejanje obstoječega artikla
      axios.put(`https://evidenca-back-end.onrender.com/inventory/${editItemId}`, newItem)
        .then(response => {
          if (!response.data.error) {
            fetchInventory();
            setShowModal(false);
            setNewItem({ item_name: '', category: '', quantity: '', location: '', description: '' });
            setIsEditMode(false);
            setEditItemId(null);
          }
        })
        .catch(error => {
          console.error('Napaka pri posodabljanju artikla:', error);
        });
    } else {
      // Dodajanje novega artikla
      axios.post('https://evidenca-back-end.onrender.com/inventory', newItem)
        .then(response => {
          if (!response.data.error) {
            fetchInventory();
            setShowModal(false);
            setNewItem({ item_name: '', category: '', quantity: '', location: '', description: '' });
          }
        })
        .catch(error => {
          console.error('Napaka pri dodajanju novega artikla:', error);
        });
    }
  };

  const handleEditItem = (item) => {
    setIsEditMode(true);
    setEditItemId(item.id);
    setNewItem({
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity,
      location: item.location,
      description: item.description
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    axios.delete(`https://evidenca-back-end.onrender.com/inventory/${itemId}`)
      .then(response => {
        if (!response.data.error) {
          fetchInventory();
        }
      })
      .catch(error => {
        console.error('Napaka pri brisanju artikla:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setNewItem({ item_name: '', category: '', quantity: '', location: '', description: '' });
    setEditItemId(null);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Shramba</h3>
          <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
            Dodaj nov artikel
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Ime artikla</th>
                <th>Kategorija</th>
                <th>Količina</th>
                <th>Lokacija</th>
                <th>Opis</th>
                <th>Ustvarjeno</th>
                <th>Posodobljeno</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.location}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                  <td>
                    <Button variant="warning" className="me-2" onClick={() => handleEditItem(item)}>
                      Uredi
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>
                      Izbriši
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal za dodajanje in urejanje artikla */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Uredi artikel' : 'Dodaj nov artikel'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="itemName">
              <Form.Label>Ime artikla</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesite ime artikla"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="category" className="mt-3">
              <Form.Label>Kategorija</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesite kategorijo artikla"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="quantity" className="mt-3">
              <Form.Label>Količina</Form.Label>
              <Form.Control
                type="number"
                placeholder="Vnesite količino"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="location" className="mt-3">
              <Form.Label>Lokacija</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesite lokacijo"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Vnesite opis"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zapri
          </Button>
          <Button variant="primary" onClick={handleAddNewItem}>
            {isEditMode ? 'Shrani spremembe' : 'Dodaj artikel'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Shramba;
