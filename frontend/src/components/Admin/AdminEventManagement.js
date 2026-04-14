import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import ChatRoom from '../Chat/ChatRoom';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  h1 { font-weight: 800; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  th, td {
    padding: 20px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background-color: #fcfcfc;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;

  button {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    font-weight: 600;
    
    &.delete { color: #d32f2f; border-color: #fecaca; background-color: #fef2f2; }
    &.edit { color: #ff5e3a; border-color: #fcece8; background-color: #fff5f2; }
    &.attendees { color: #2196f3; border-color: #e3f2fd; background-color: #e3f2fd; }
    &:hover { opacity: 0.8; }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const AttendeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  
  .info {
    span { font-weight: 700; }
  }

  button {
    background: #ff5e3a;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const AdminEventManagement = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { attendeeId, username }
  const [editingEvent, setEditingEvent] = useState(null); // The event being edited
  const [editFormData, setEditFormData] = useState({});

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Fetch Events Error:', error);
    }
  };

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(`/events/${eventId}/attendees`);
      setAttendees(response.data);
      const event = events.find(e => e._id === eventId);
      setSelectedEvent(event);
    } catch (error) {
      alert('Failed to fetch attendees');
    }
  };

  useEffect(() => {
    fetchEvents();

    const socket = io('http://localhost:5000', {
      query: { token: localStorage.getItem('token') }
    });

    socket.on('ticket_purchased', (data) => {
      console.log('Real-time update received:', data);
      fetchEvents(); // Refresh data in real-time
    });

    return () => socket.disconnect();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().split('T')[0],
      price: event.price,
      category: event.category,
      totalTickets: event.totalTickets,
      imageUrl: event.imageUrl,
      hiddenInfo: event.hiddenInfo || '',
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/events/${editingEvent._id}`, editFormData);
      alert('Event updated successfully!');
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container>
      <Header>
        <h1>Event Management</h1>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Category</th>
            <th>Sales</th>
            <th>Revenue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td style={{ fontWeight: 600 }}>{event.title}</td>
              <td>{event.category}</td>
              <td>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{event.ticketsSold} / {event.totalTickets}</div>
                <div style={{ height: '4px', width: '100px', background: '#eee', borderRadius: '2px', marginTop: '4px' }}>
                  <div style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%`, height: '100%', background: '#ff5e3a' }} />
                </div>
              </td>
              <td style={{ color: '#4caf50', fontWeight: 700 }}>${event.ticketsSold * event.price}</td>
              <td>
                <Actions>
                  <button className="attendees" onClick={() => fetchAttendees(event._id)}>Attendees</button>
                  <button className="edit" onClick={() => handleEditClick(event)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(event._id)}>Delete</button>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Attendees Modal */}
      {selectedEvent && (
        <ModalOverlay onClick={() => setSelectedEvent(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 800 }}>Attendees for "{selectedEvent.title}"</h2>
              <button onClick={() => setSelectedEvent(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>
            {attendees.length > 0 ? (
              attendees.map(att => (
                <AttendeeItem key={att._id}>
                  <div className="info">
                    <span>{att.username}</span> ({att.email})
                  </div>
                  <button onClick={() => setActiveChat({ attendeeId: att._id, username: att.username })}>
                    Chat with Attendee
                  </button>
                </AttendeeItem>
              ))
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No attendees yet for this event.</p>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <ModalOverlay onClick={() => setEditingEvent(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: 800 }}>Edit Event Details</h2>
              <button onClick={() => setEditingEvent(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>
            
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Title</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} name="category" value={editFormData.category} onChange={handleEditFormChange}>
                    <option value="Music">Music</option>
                    <option value="Tech">Tech</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} name="description" value={editFormData.description} onChange={handleEditFormChange} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Location</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} type="text" name="location" value={editFormData.location} onChange={handleEditFormChange} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Date</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} type="date" name="date" value={editFormData.date} onChange={handleEditFormChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Price ($)</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} type="number" name="price" value={editFormData.price} onChange={handleEditFormChange} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Total Tickets</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} type="number" name="totalTickets" value={editFormData.totalTickets} onChange={handleEditFormChange} required />
                </div>
              </div>

              <div style={{ marginBottom: '16px', padding: '16px', background: '#fff9f6', borderRadius: '12px', border: '1px dashed #ffdccf' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#ff5e3a' }}>Hidden Instructions (Post-Purchase)</label>
                <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} name="hiddenInfo" value={editFormData.hiddenInfo} onChange={handleEditFormChange} placeholder="Zoom links, secrets, etc." />
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', background: '#ff5e3a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>
                Update Event Details
              </button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Chat Modal */}
      {activeChat && (
        <ModalOverlay onClick={() => setActiveChat(null)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ padding: 0, maxWidth: '500px' }}>
            <ChatRoom 
              attendeeId={activeChat.attendeeId}
              eventId={selectedEvent._id}
              adminId={user.userId}
              currentUserId={user.userId}
            />
            <button 
              onClick={() => setActiveChat(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'white', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Close
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminEventManagement;
