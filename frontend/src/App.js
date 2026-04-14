import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import EventList from './components/Event/EventList';
import CreateEvent from './components/Event/CreateEvent';
import MyPurchasedEvents from './components/Event/MyPurchasedEvents';
import AttendeeList from './components/Admin/AttendeeList';
import AdminEventManagement from './components/Admin/AdminEventManagement';
import { useAuth } from './contexts/AuthContext';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f7f9fc;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  position: fixed;
  height: 100vh;
  z-index: 10;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 40px;
`;

const SidebarItem = styled.div`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.active ? '#ff5e3a' : '#666'};
  background-color: ${props => props.active ? '#fff5f2' : 'transparent'};
  font-weight: ${props => props.active ? '700' : '500'};
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AuthLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = window.location.pathname;

  const isAdmin = user?.role === 'admin';

  return (
    <Layout>
      <Sidebar>
        <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '40px', color: '#ff5e3a' }}>Ventixe</div>
        
        {isAdmin ? (
          <>
            <SidebarItem active={path === '/admin-dashboard'} onClick={() => navigate('/admin-dashboard')}>Analytics</SidebarItem>
            <SidebarItem active={path === '/events'} onClick={() => navigate('/events')}>Events</SidebarItem>
            <SidebarItem active={path === '/attendees'} onClick={() => navigate('/attendees')}>Attendees</SidebarItem>
            <SidebarItem active={path === '/event-management'} onClick={() => navigate('/event-management')}>Event Management</SidebarItem>
            <SidebarItem active={path === '/create-event'} onClick={() => navigate('/create-event')}>Create New Event</SidebarItem>
            <SidebarItem onClick={() => alert('Settings coming soon!')}>Settings</SidebarItem>
          </>
        ) : (
          <>
            <SidebarItem active={path === '/dashboard'} onClick={() => navigate('/dashboard')}>Dashboard</SidebarItem>
            <SidebarItem active={path === '/events'} onClick={() => navigate('/events')}>Explore Events</SidebarItem>
            <SidebarItem active={path === '/purchased-events'} onClick={() => navigate('/purchased-events')}>My Tickets</SidebarItem>
          </>
        )}
        
        <div style={{ flex: 1 }}></div>
        <SidebarItem onClick={logout} style={{ color: '#d32f2f' }}>Sign Out</SidebarItem>
      </Sidebar>
      <MainContent>{children}</MainContent>
    </Layout>
  );
};

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} /> : <Home />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} /> : <Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AuthLayout><UserDashboard /></AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AuthLayout><AdminDashboard /></AuthLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/attendees"
          element={
            <AdminRoute>
              <AuthLayout><AttendeeList /></AuthLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/event-management"
          element={
            <AdminRoute>
              <AuthLayout><AdminEventManagement /></AuthLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <AuthLayout><EventList /></AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <AdminRoute>
              <AuthLayout><CreateEvent /></AuthLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/purchased-events"
          element={
            <PrivateRoute>
              <AuthLayout><MyPurchasedEvents /></AuthLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return (isAuthenticated() && user?.role === 'admin') ? children : <Navigate to="/dashboard" />;
};

export default App;
