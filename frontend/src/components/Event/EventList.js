import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const EventCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Badge = styled.span`
  background-color: #fcece8;
  color: #ff5e3a;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
  display: inline-block;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 700;
`;

const MetaInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketInfo = styled.div`
  margin-top: 16px;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .progress-bar {
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
    
    .fill {
      height: 100%;
      background-color: #ff5e3a;
      transition: width 0.3s;
    }
  }
`;

const PurchaseButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ff5e3a;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:disabled {
    background-color: #ccc;
    cursor: default;
  }
`;

const EventList = () => {
  const { user, updatePurchasedEvents } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePurchase = async (eventId) => {
    try {
      const response = await axios.post(`/events/purchase/${eventId}`);
      alert('Successfully purchased event ticket!');
      
      // Update global user state with new purchasedEvents list
      if (response.data.purchasedEvents) {
        updatePurchasedEvents(response.data.purchasedEvents);
      }
      
      fetchEvents(); // Refresh event sales data
    } catch (error) {
      alert('Purchase failed: ' + (error.response?.data?.message || 'Error occurred'));
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontWeight: '800' }}>Events</h1>
        <input 
          type="text" 
          placeholder="Search event, location..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #ddd', width: '300px' }}
        />
      </div>

      <EventGrid>
        {filteredEvents.map((event) => {
          const soldPercentage = Math.round((event.ticketsSold / event.totalTickets) * 100);
          const isOwner = user && event.creator._id === user.userId;
          const isPurchased = user && user.purchasedEvents?.includes(event._id);

          return (
            <EventCard key={event._id}>
              <CardImage src={event.imageUrl || 'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=600'} alt={event.title} />
              <CardContent>
                <Badge>{event.category.toUpperCase()}</Badge>
                <Title>{event.title}</Title>
                <MetaInfo>
                  <div>📍 {event.location}</div>
                  <div>📅 {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                </MetaInfo>

                <TicketInfo>
                  <div className="progress-header">
                    <span>{soldPercentage}% Ticket Sold</span>
                    <span>{event.totalTickets - event.ticketsSold} Left</span>
                  </div>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${soldPercentage}%` }}></div>
                  </div>
                </TicketInfo>

                {user && user.role === 'user' && !isPurchased && (
                  <PurchaseButton onClick={() => handlePurchase(event._id)}>
                    <span>Buy Ticket</span>
                    <span>${event.price}</span>
                  </PurchaseButton>
                )}

                {user && user.role === 'user' && isPurchased && (
                  <PurchaseButton disabled style={{ backgroundColor: '#4caf50' }}>
                    Purchased ✅
                  </PurchaseButton>
                )}

                {isOwner && (
                  <PurchaseButton onClick={() => alert('Manage Event logic coming soon!')} style={{ backgroundColor: '#333' }}>
                    Manage Event ⚙️
                  </PurchaseButton>
                )}
              </CardContent>
            </EventCard>
          );
        })}
      </EventGrid>
    </div>
  );
};

export default EventList;
