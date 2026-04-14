const Event = require('../models/Event');
const User = require('../models/User');

const getAdminAnalytics = async (req, res) => {
  try {
    const events = await Event.find();
    
    // 1. Total Revenue
    const totalRevenue = events.reduce((acc, event) => acc + (event.price * event.ticketsSold), 0);
    
    // 2. Average Attendance Rate
    const totalTicketsSold = events.reduce((acc, event) => acc + event.ticketsSold, 0);
    const totalCapacity = events.reduce((acc, event) => acc + event.totalTickets, 0);
    const averageAttendance = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;
    
    // 3. Total Events
    const totalEvents = events.length;
    
    // 4. Monthly Attendance (Last 6 Months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAttendance = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      
      // Calculate sales for this month across all events
      const salesInMonth = events
        .filter(e => {
          const eDate = new Date(e.date);
          return eDate.getMonth() === d.getMonth() && eDate.getFullYear() === d.getFullYear();
        })
        .reduce((acc, e) => acc + e.ticketsSold, 0);

      monthlyAttendance.push({
        name: mName,
        value: salesInMonth,
        highlight: i === 0 // Highlight current month
      });
    }

    // 5. Revenue Breakdown (By Category)
    const categoryTotals = {};
    events.forEach(event => {
      const rev = event.price * event.ticketsSold;
      categoryTotals[event.category] = (categoryTotals[event.category] || 0) + rev;
    });

    const revenueBreakdown = Object.keys(categoryTotals).map(cat => {
      const amount = categoryTotals[cat];
      const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
      return { label: `${cat} Tickets`, value: percentage, amount };
    });

    res.json({
      totalRevenue,
      averageAttendance,
      totalEvents,
      monthlyAttendance,
      revenueBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAdminAnalytics };
