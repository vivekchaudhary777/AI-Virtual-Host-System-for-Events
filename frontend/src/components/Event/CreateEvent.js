import React, { useState } from 'react';
import axios from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CreateContainer = styled.div`
  max-width: 700px;
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const FormTitle = styled.h2`
  margin-bottom: 24px;
  font-weight: 800;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #ff5e3a;
    }
  }

  textarea { height: 80px; }
`;

const HiddenSection = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #fff9f6;
  border-radius: 12px;
  border: 1px dashed #ffdccf;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #ff5e3a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;

  &:hover {
    opacity: 0.9;
  }
`;

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Music',
    location: '',
    price: 0,
    totalTickets: 100,
    imageUrl: '',
    hiddenInfo: '',
    hiddenPhotos: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handlePhotosChange = (e) => {
    const urls = e.target.value.split(',').map(u => u.trim()).filter(u => u !== '');
    setEventData({ ...eventData, hiddenPhotos: urls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...eventData,
        price: Number(eventData.price),
        totalTickets: Number(eventData.totalTickets),
      };
      
      console.log('Sending Event Payload:', payload);
      await axios.post('/events', payload);
      alert('Event created successfully!');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Creation Error:', error.response?.data || error.message);
      alert('Creation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <CreateContainer>
      <FormTitle>Host a New Event (Admin Only)</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Event Title</label>
          <input type="text" name="title" required onChange={handleInputChange} placeholder="e.g. Echo Beats Festival" />
        </FormGroup>
        
        <FormGroup>
          <label>Description</label>
          <textarea name="description" onChange={handleInputChange} placeholder="General public info..." />
        </FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <FormGroup>
            <label>Location</label>
            <input type="text" name="location" required onChange={handleInputChange} placeholder="Virtual/Venue" />
          </FormGroup>
          <FormGroup>
            <label>Date</label>
            <input type="date" name="date" required onChange={handleInputChange} />
          </FormGroup>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <FormGroup>
            <label>Price ($)</label>
            <input type="number" name="price" required onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <label>Category</label>
            <select name="category" onChange={handleInputChange}>
              <option value="Music">Music</option>
              <option value="Tech">Tech</option>
              <option value="Social">Social</option>
            </select>
          </FormGroup>
        </div>

        <HiddenSection>
          <h4 style={{ color: '#ff5e3a', marginBottom: '16px' }}>Secure Hidden Content (Post-Purchase Only)</h4>
          <FormGroup>
            <label>Hidden Instructions & Links</label>
            <textarea name="hiddenInfo" onChange={handleInputChange} placeholder="Zoom links, private codes, etc." />
          </FormGroup>
          <FormGroup>
            <label>Hidden Demo Photo URLs (Comma-separated)</label>
            <input type="text" placeholder="https://image1.jpg, https://image2.jpg" onChange={handlePhotosChange} />
          </FormGroup>
        </HiddenSection>

        <SubmitButton type="submit">Publish Event</SubmitButton>
      </form>
    </CreateContainer>
  );
};

export default CreateEvent;
