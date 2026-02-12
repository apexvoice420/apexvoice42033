require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Routes
app.use('/api/scraper', require('./routes/scraper'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/campaigns', require('./routes/campaigns'));
// app.use('/api/stats', require('./routes/stats'));
app.use('/api/webhooks', require('./routes/webhooks'));

// Health check
app.get('/', (req, res) => {
    res.send('Apex Voice Solutions API is running 🚀');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        service: 'Apex Voice Solutions API'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
