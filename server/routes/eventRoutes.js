const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, joinEvent, purchaseTicket, getAttendees } = require('../controllers/eventController');
const { getAdminAnalytics } = require('../controllers/analyticsController');
const { auth } = require('../middlewares/authMiddleware');

// Define routes
router.get('/', auth, getEvents);
router.get('/:id', auth, getEventById); // New Detail Route
router.post('/', auth, createEvent); // Protected
router.put('/:id', auth, updateEvent); // Protected
router.delete('/:id', auth, deleteEvent); // Protected
router.get('/analytics', auth, getAdminAnalytics); // New Analytics Endpoint
router.post('/join/:eventId', auth, joinEvent); // Protected
router.post('/purchase/:eventId', auth, purchaseTicket); // New Endpoint
router.get('/:id/attendees', auth, getAttendees); // New Attendee List Route

module.exports = router;
