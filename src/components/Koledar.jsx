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

  const formatDate = (date) => {
    if (date && !isNaN(new Date(date).getTime())) {
      return new Date(date);
    }
    return null;
  };

  useEffect(() => {
    axios.get('https://evidenca-back-end.onrender.com/events')
      .then(response => {
        if (!response.data.error) {
          setEvents(response.data.data.map(event => ({
            id: event.id,
            title: event.title,
            start: formatDate(event.start),
            end: formatDate(event.end),
            user_name: `${event.first_name} ${event.last_name}`
          })));
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju dogodkov:', error);
      });
  }, []);

  const handleAddEvent = () => {
    const eventToAdd = { ...newEvent, user_id: user.id };
    axios.post('https://evidenca-back-end.onrender.com/add-event', eventToAdd).then((response) => {
      if (!response.data.error) {
        setEvents([...events, {
          ...response.data.data,
          start: formatDate(response.data.data.start),
          end: formatDate(response.data.data.end),
          user_name: `${user.name} ${user.surname}`
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

    const updatedEvent = {
      ...selectedEvent,
      start: new Date(selectedEvent.start).toISOString(),
      end: new Date(selectedEvent.end).toISOString()
    };

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

  const handleDeleteEvent = () => {
    if (!selectedEvent || !selectedEvent.id) {
      console.error('Event ID is missing or undefined.');
      return;
    }

    axios.delete(`https://evidenca-back-end.onrender.com/delete-event/${selectedEvent.id}`)
      .then(response => {
        if (!response.data.error) {
          setEvents(events.filter(event => event.id !== selectedEvent.id));
          setShowEditModal(false);
          setSelectedEvent(null);
        } else {
          console.error('Server error during event deletion:', response.data.error);
        }
      })
      .catch(error => {
        console.error('Error during event deletion:', error);
      });
  };

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
          <Button variant="danger" onClick={handleDeleteEvent}>
            Izbriši dogodek
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
