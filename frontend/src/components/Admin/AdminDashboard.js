import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const DashboardContainer = styled.div`
  max-width: 1200px;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  margin-bottom: 32px;
  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a1a;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const AnalyticsCard = styled.div`
  padding: 32px;
  border-radius: 24px;
  color: white;
  position: relative;
  background: ${props => props.gradient};
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  overflow: hidden;

  .date {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 16px;
    display: block;
  }

  .label {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 24px;
    display: block;
  }

  .value {
    font-size: 40px;
    font-weight: 800;
    display: block;
  }

  .subtext {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 8px;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const ChartSection = styled.div`
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  margin-bottom: 40px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    h3 { font-weight: 700; }
  }
`;

const BarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: 12px;
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Bar = styled.div`
  width: 100%;
  max-width: 40px;
  height: ${props => props.height}%;
  background: ${props => props.highlight ? '#6259ca' : '#e2e1f5'};
  border-radius: 8px;
  transition: height 0.5s ease-out;
  position: relative;

  &:hover {
    filter: brightness(0.9);
  }
`;

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/events/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Analytics Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    let token = null;
    try {
      const authData = localStorage.getItem('vep_auth');
      token = authData ? JSON.parse(authData).token : null;
    } catch (e) {
      console.error('Error parsing auth data:', e);
    }

    const socket = io('http://localhost:5000', {
      query: { token }
    });

    const refreshData = () => {
      console.log('Refreshing analytics due to event/purchase update...');
      fetchAnalytics();
    };

    socket.on('ticket_purchased', refreshData);
    socket.on('event_created', refreshData);
    socket.on('event_deleted', refreshData);

    return () => socket.disconnect();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <DashboardContainer>
      <Header>
        <h1>Analytics</h1>
      </Header>

      <StatsGrid>
        <AnalyticsCard gradient="linear-gradient(135deg, #8e44ad, #9b59b6)">
          <span className="date">Dec 5, 2024</span>
          <span className="label">Total Revenue Generated</span>
          <span className="value">${data?.totalRevenue?.toLocaleString()}.0</span>
          <span className="subtext">Sales</span>
        </AnalyticsCard>

        <AnalyticsCard gradient="linear-gradient(135deg, #16a085, #1abc9c)">
          <span className="date">Dec 5, 2024</span>
          <span className="label">Average Attendance Rate</span>
          <span className="value">{data?.averageAttendance}%</span>
          <span className="subtext">Average</span>
        </AnalyticsCard>

        <AnalyticsCard gradient="linear-gradient(135deg, #2980b9, #3498db)">
          <span className="date">Dec 5, 2024</span>
          <span className="label">Total Events Active</span>
          <span className="value">{data?.totalEvents}+</span>
          <span className="subtext">Events</span>
        </AnalyticsCard>
      </StatsGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <ChartSection>
          <div className="header">
            <h3>Attendance Analytics</h3>
          </div>
          <BarContainer>
            {data?.monthlyAttendance?.map((item, id) => (
              <BarWrapper key={id}>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.value}</div>
                <Bar height={(item.value / 500) * 100} highlight={item.highlight} />
                <div style={{ fontSize: '12px', fontWeight: '600' }}>{item.name}</div>
              </BarWrapper>
            ))}
          </BarContainer>
        </ChartSection>

        <ChartSection>
          <h3>Revenue Breakdown</h3>
          <div style={{ marginTop: '40px' }}>
            {data?.revenueBreakdown?.map((item, id) => (
              <div key={id} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{item.value}%</span>
                </div>
                <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.value}%`, height: '100%', background: '#6259ca' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>${item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </ChartSection>
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
