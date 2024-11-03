import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function Koledar() {
  const { user } = useContext(AuthContext); // Pridobimo prijavljenega uporabnika
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });


  // Funkcija za preverjanje in formatiranje datuma
  const formatDate = (date) => {
    if (date && !isNaN(new Date(date).getTime())) {
      return new Date(date);
    }
    return null;
  };

  // Naložimo dogodke iz baze
  useEffect(() => {
    axios.get('https://evidenca-back-end.onrender.com/events')
      .then(response => {
        if (!response.data.error) {
          setEvents(response.data.data.map(event => ({
            id: event.id,
            title: event.title,
            start: formatDate(event.start),
            end: formatDate(event.end),
            user_name: `${event.first_name} ${event.last_name}` // Assuming API provides user name and surname
          })));
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju dogodkov:', error);
      });
  }, []);

  // Dodajanje novega dogodka
  const handleAddEvent = () => {
    const eventToAdd = { ...newEvent, user_id: user.id };
    axios.post('https://evidenca-back-end.onrender.com/add-event', eventToAdd).then((response) => {
      if (!response.data.error) {
        setEvents([...events, {
          ...response.data.data,
          start: formatDate(response.data.data.start),
          end: formatDate(response.data.data.end),
          user_name: `${user.name} ${user.surname}` // Adding current user name and surname
        }]);
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '' });
      }
    }).catch(error => {
      console.error('Napaka pri dodajanju dogodka:', error);
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({ title: '', start: '', end: '' });
  };

  const handleEventMouseOver = (event, e) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      user_name: event.user_name
    });
    setPosition({
      top: e.clientY + 10,
      left: e.clientX + 10,
    });
  };

  const handleEventMouseOut = () => {
    setSelectedEvent(null);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    if (!selectedEvent || !selectedEvent.id) {
        console.error('Event ID is missing or undefined.');
        return;
    }

    // Convert dates to ISO format
    const updatedEvent = {
        ...selectedEvent,
        start: new Date(selectedEvent.start).toISOString(),
        end: new Date(selectedEvent.end).toISOString()
    };

    console.log('Updating event with ID:', selectedEvent.id);
    console.log('Updated event data:', updatedEvent);

    axios.put(`https://evidenca-back-end.onrender.com/update-event/${selectedEvent.id}`, updatedEvent)
        .then(response => {
            if (!response.data.error) {
                setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
                setShowEditModal(false);
            } else {
                console.error('Server error during event update:', response.data.error);
            }
        })
        .catch(error => {
            console.error('Error during event update:', error);
        });
};



  // Filtriramo dogodke glede na vlogo
  const filteredEvents = user.role === 'superadmin' ? events : events.filter(event => event.user_id === user.id);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Koledar</h3>
          {user.role !== 'user' && (
            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
              Dodaj nov termin
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            defaultView="month"
            views={['month', 'week', 'day']}
            onSelectEvent={(event, e) => handleEventMouseOver(event, e)}
            onMouseOut={handleEventMouseOut}
          />
        </Col>
      </Row>

      {/* Pojavno okno z informacijami o dogodku */}
      {selectedEvent && (
        <div className="event-details" style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          backgroundColor: '#f8f9fa',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5>{selectedEvent.title}</h5>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#000'
              }}
              onClick={handleEventMouseOut}
            >
              X
            </button>
          </div>
          <p><strong>Začetek:</strong> {selectedEvent.start ? selectedEvent.start.toLocaleString() : 'N/A'}</p>
          <p><strong>Konec:</strong> {selectedEvent.end ? selectedEvent.end.toLocaleString() : 'N/A'}</p>
          <p><strong>Uporabnik:</strong> {user.role === 'superadmin' ? selectedEvent.user_name : 'Zasedeno'}</p>
          {user.role === 'superadmin' && (
            <Button variant="warning" onClick={handleEditClick}>
              Uredi dogodek
            </Button>
          )}
        </div>
      )}


      {/* Modal za dodajanje novega termina */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj nov termin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Naslov</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesi naslov termina"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventStart" className="mt-3">
              <Form.Label>Začetek</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventEnd" className="mt-3">
              <Form.Label>Konec</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zapri
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Dodaj termin
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal za urejanje termina */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Uredi dogodek</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitleEdit">
              <Form.Label>Naslov</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesi naslov termina"
                value={selectedEvent?.title || ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventStartEdit" className="mt-3">
              <Form.Label>Začetek</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedEvent?.start ? new Date(selectedEvent.start).toISOString().substring(0, 16) : ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventEndEdit" className="mt-3">
              <Form.Label>Konec</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedEvent?.end ? new Date(selectedEvent.end).toISOString().substring(0, 16) : ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Zapri
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Shrani spremembe
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Koledar;
