const Event = require('../models/Event');
const User = require('../models/User');

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'username');
    
    const user = req.user ? await User.findById(req.user.userId) : null;
    const purchasedIds = user ? user.purchasedEvents.map(id => id.toString()) : [];
    const isAdmin = user ? user.role === 'admin' : false;

    // Strip hidden info for general list
    const filteredEvents = events.map(event => {
      const isPurchased = purchasedIds.includes(event._id.toString());
      
      if (!isPurchased && !isAdmin) {
        const e = event.toObject();
        delete e.hiddenInfo;
        delete e.hiddenPhotos;
        return e;
      }
      return event;
    });

    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'username');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const user = await User.findById(req.user.userId);
    const isPurchased = user.purchasedEvents.includes(event._id);
    const isAdmin = user.role === 'admin';

    if (!isPurchased && !isAdmin) {
      const e = event.toObject();
      delete e.hiddenInfo;
      delete e.hiddenPhotos;
      return res.json(e);
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, price, category, location, imageUrl, hiddenInfo, hiddenPhotos } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create events' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      creator: userId,
      price,
      category,
      location,
      imageUrl,
      hiddenInfo,
      hiddenPhotos
    });

    await newEvent.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('event_created', newEvent);
    }

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;
    const body = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is Admin OR the creator
    const user = await User.findById(userId);
    if (user.role !== 'admin' && event.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, body, { new: true, runValidators: true });
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const user = await User.findById(userId);
    if (user.role !== 'admin' && event.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(eventId);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('event_deleted', { eventId });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees.some((attendee) => attendee.toString() === userId)) {
      return res.status(400).json({ message: 'User already attending' });
    }

    event.attendees.push(userId);
    await event.save();
    res.status(200).json({ message: 'User joined successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const purchaseTicket = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    if (!event || !user) return res.status(404).json({ message: 'Not found' });

    if (event.ticketsSold >= event.totalTickets) {
      return res.status(400).json({ message: 'Sold out' });
    }

    if (user.purchasedEvents.includes(eventId)) {
      return res.status(400).json({ message: 'Already purchased' });
    }

    user.purchasedEvents.push(eventId);
    await user.save();

    event.ticketsSold += 1;
    event.attendees.push(userId);
    await event.save();

    // Emit real-time update to all connected clients (especially admins)
    const io = req.app.get('io');
    if (io) {
      io.emit('ticket_purchased', { 
        eventId, 
        ticketsSold: event.ticketsSold, 
        revenue: event.ticketsSold * event.price 
      });
    }

    res.status(200).json({ 
      message: 'Ticket purchased!', 
      purchasedEvents: user.purchasedEvents 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'username email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Authorization: Only admin or creator can view attendee list
    if (req.user.role !== 'admin' && event.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(event.attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  purchaseTicket,
  getAttendees
};
