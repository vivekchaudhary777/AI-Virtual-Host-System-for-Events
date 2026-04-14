import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import ChatRoom from '../Chat/ChatRoom';

const Container = styled.div`
  max-width: 1000px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
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

const ContactButton = styled.button`
  background-color: #ff5e3a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AttendeeList = () => {
  const { user: currentUser } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get('/events'); // We'll get all events and flatten attendees
        const allEvents = response.data;
        
        let attendeeMap = {};
        allEvents.forEach(event => {
          event.attendees.forEach(attId => {
            if (!attendeeMap[attId]) attendeeMap[attId] = { id: attId, events: [] };
            attendeeMap[attId].events.push(event);
          });
        });

        // Normally we'd fetch full user objects, for now using IDs and event history
        setAttendees(Object.values(attendeeMap));
      } catch (error) {
        console.error('Fetch Attendees Error:', error);
      }
    };
    fetchAttendees();
  }, []);

  return (
    <Container>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontWeight: '900' }}>Attendees</h1>
        <p style={{ color: '#666' }}>Manage and support your event participants</p>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Attendee ID</th>
            <th>Registered Events</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((att, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>User_{att.id.substring(0, 8)}</td>
              <td>
                {att.events.map(e => (
                  <div key={e._id} style={{ fontSize: '13px', margin: '4px 0', color: '#ff5e3a', fontWeight: 600 }}>
                    • {e.title}
                  </div>
                ))}
              </td>
              <td>
                <ContactButton onClick={() => setActiveChat({ attendeeId: att.id, eventId: att.events[0]._id, adminId: currentUser.userId })}>
                  Contact Attendee
                </ContactButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {activeChat && (
        <ModalOverlay onClick={() => setActiveChat(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '400px' }}>
            <ChatRoom 
              attendeeId={activeChat.attendeeId} 
              eventId={activeChat.eventId} 
              adminId={activeChat.adminId} 
              currentUserId={currentUser.userId} 
            />
          </div>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AttendeeList;
