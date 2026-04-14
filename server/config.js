// server/config.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET ,
  AI_SERVICE_API_KEY: process.env.AI_SERVICE_API_KEY ,
  // Add other configuration variables as needed
};
