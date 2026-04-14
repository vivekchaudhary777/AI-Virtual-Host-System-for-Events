import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../services/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  max-width: 1000px;
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-weight: 800;
  }

  .see-all {
    color: #ff5e3a;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .label {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 900;
    color: #333;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  }
`;

const MiniCard = styled.div`
  min-width: 250px;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  
  .title {
    font-weight: 700;
    margin-bottom: 4px;
  }
  .date {
    font-size: 12px;
    color: #666;
  }
`;

const UserDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error.message);
      }
    };

    fetchEvents();
  }, []);

  const myPurchased = events.filter(e => user.purchasedEvents?.includes(e._id));
  const myCreated = events.filter(e => e.creator?._id === user.userId);
  const featured = events.slice(0, 5);

  return (
    <DashboardContainer>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontWeight: '900', marginBottom: '8px' }}>Welcome back, {user?.username}! 👋</h1>
        <p style={{ color: '#666' }}>Ready to manage or explore new events today?</p>
      </div>

      <StatsGrid>
        <StatCard>
          <div className="label">Total Events Joined</div>
          <div className="value">{myPurchased.length}</div>
        </StatCard>
        {user.role === 'vendor' && (
          <StatCard>
            <div className="label">Events You Host</div>
            <div className="value">{myCreated.length}</div>
          </StatCard>
        )}
        <StatCard>
          <div className="label">Upcoming Events</div>
          <div className="value">{events.length}</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>My Recent Tickets 🎟️</h2>
          <div className="see-all" onClick={() => navigate('/purchased-events')}>View All</div>
        </SectionHeader>
        {myPurchased.length > 0 ? (
          <HorizontalScroll>
            {myPurchased.map(event => (
              <MiniCard key={event._id} onClick={() => navigate('/purchased-events')}>
                <div className="title">{event.title}</div>
                <div className="date">{new Date(event.date).toDateString()}</div>
              </MiniCard>
            ))}
          </HorizontalScroll>
        ) : (
          <div style={{ padding: '20px', color: '#666' }}>You haven't joined any events yet.</div>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h2>Featured Events for You ✨</h2>
          <div className="see-all" onClick={() => navigate('/events')}>Explore More</div>
        </SectionHeader>
        <HorizontalScroll>
          {featured.map(event => (
            <MiniCard key={event._id} onClick={() => navigate('/events')}>
              <div className="title">{event.title}</div>
              <div className="date">{new Date(event.date).toDateString()}</div>
              <div style={{ marginTop: '8px', color: '#ff5e3a', fontWeight: '700', fontSize: '14px' }}>${event.price}</div>
            </MiniCard>
          ))}
        </HorizontalScroll>
      </Section>
    </DashboardContainer>
  );
};

export default UserDashboard;
