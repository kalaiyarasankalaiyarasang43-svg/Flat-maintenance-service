const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: [/\.onrender\.com$/, /^http:\/\/localhost(?::\d+)?$/],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'flat-maintenance-api', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes will be imported here
const authRoutes = require('./routes/auth');
const flatsRoutes = require('./routes/flats');
const servicesRoutes = require('./routes/services');
const requestsRoutes = require('./routes/requests');
const complaintsRoutes = require('./routes/complaints');
const workersRoutes = require('./routes/workers');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/flats', flatsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production (Single Port if built)
const frontendDist = path.join(__dirname, '../frontend/dist');
const fs = require('fs');
if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist));
  app.use((req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Flat Maintenance API is running.');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
