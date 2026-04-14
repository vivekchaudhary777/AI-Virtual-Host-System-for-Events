import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import ChatRoom from '../Chat/ChatRoom';

const ListContainer = styled.div`
  max-width: 900px;
`;

const TicketCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const HiddenSection = styled.div`
  margin-top: 24px;
  padding: 24px;
  background-color: #fffaf5;
  border-radius: 12px;
  border: 1px dashed #ffd7cc;

  h4 { color: #ff5e3a; margin-bottom: 16px; font-weight: 700; }
  p { line-height: 1.6; color: #444; }
  a { color: #ff5e3a; text-decoration: underline; font-weight: 600; }
`;

const PhotoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
  
  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    cursor: zoom-in;
  }
`;

const ChatToggle = styled.button`
  background-color: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  margin-top: 24px;
  cursor: pointer;
  display: block;
`;

const MyPurchasedEvents = () => {
  const [purchasedEvents, setPurchasedEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null); // The one the user has "entered"
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const response = await axios.get('/events');
        // Robust filtering: compare IDs as strings
        const purchasedIds = (user.purchasedEvents || []).map(id => id.toString());
        const filtered = response.data.filter(e => purchasedIds.includes(e._id.toString()));
        setPurchasedEvents(filtered);
      } catch (error) {
        console.error('Fetch Purchased Error:', error);
      }
    };
    if (user?.purchasedEvents) fetchPurchased();
  }, [user]);

  const enterEvent = async (id) => {
    try {
      const response = await axios.get(`/events/${id}`);
      setActiveEvent(response.data);
      setShowChat(false);
    } catch (error) {
      alert('Could not enter event');
    }
  };

  return (
    <ListContainer>
      <h1 style={{ fontWeight: 800, marginBottom: '32px' }}>My Tickets</h1>

      {!activeEvent ? (
        purchasedEvents.map(event => (
          <TicketCard key={event._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{event.title}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}</div>
              </div>
              <button 
                onClick={() => enterEvent(event._id)}
                style={{ backgroundColor: '#ff5e3a', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Enter Event
              </button>
            </div>
          </TicketCard>
        ))
      ) : (
        <div style={{ background: 'white', padding: '32px', borderRadius: '20px' }}>
          <button onClick={() => setActiveEvent(null)} style={{ color: '#ff5e3a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, marginBottom: '20px' }}>← Back to Tickets</button>
          <h2 style={{ fontWeight: 900, marginBottom: '8px' }}>{activeEvent.title}</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{activeEvent.description}</p>

          <HiddenSection>
            <h4>Event Access Instructions</h4>
            <div dangerouslySetInnerHTML={{ __html: (activeEvent.hiddenInfo || '').replace(/\b(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>') }} />
            
            {activeEvent.hiddenPhotos?.length > 0 && (
              <>
                <h4 style={{ marginTop: '24px' }}>Event Demo Gallery</h4>
                <PhotoGallery>
                  {activeEvent.hiddenPhotos.map((url, i) => <img key={i} src={url} alt={`Demo ${i}`} />)}
                </PhotoGallery>
              </>
            )}
          </HiddenSection>

          <ChatToggle onClick={() => setShowChat(!showChat)}>
            {showChat ? 'Close Chat' : 'Chat with Event Admin'}
          </ChatToggle>

          {showChat && (
            <div style={{ marginTop: '24px' }}>
              <ChatRoom 
                attendeeId={user.userId} 
                eventId={activeEvent._id} 
                adminId={activeEvent.creator._id} 
                currentUserId={user.userId} 
              />
            </div>
          )}
        </div>
      )}
    </ListContainer>
  );
};

export default MyPurchasedEvents;
