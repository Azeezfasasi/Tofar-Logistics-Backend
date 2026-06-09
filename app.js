require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: [
    'https://tofar-logistics-agency.netlify.app',
    'https://tofarcargo.com',
    'https://www.tofarcargo.com',
    'http://www.tofarcargo.com',
    'https://tofar-logistics-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    '*' // Allow iOS app requests (in-app browsers)
  ], // Your frontend URLs
  credentials: true, // Allow cookies/auth headers to be sent
  // methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'], // Explicitly allowed methods
   methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allowed headers
  optionsSuccessStatus: 200, // Status for preflight requests (iOS requirement)
}));

// Fix for large base64 uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Register all routes after app is initialized
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/contact', require('./routes/contactFormRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/prayer-requests', require('./routes/prayerRequestRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/shipment-statuses', require('./routes/shipmentStatusRoutes'));
app.use('/api/messageslides', require('./routes/meesageslidesRoutes'));
app.use('/api/sms', require('./routes/smsRoutes'));

app.get('/', (req, res) => {
  res.send('Welcome to Tofar Logistics Agency!');
});

// Wake-up endpoint - keeps Render.com backend alive
app.get('/api/wakeup', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
