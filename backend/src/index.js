require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Middleware
const requireAuth = require('./middleware/auth');
// Routes
const friendRoute = require('./routes/friends');
const itemRoute = require('./routes/items');
// Helpers
const getToken = require('./tools');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// basic get route
app.get('/', (req, res) => {
    res.json({
        status: 'active',
        message: 'MB Backend firing 🚀'
    }) 
});

app.get('/debug/token', (req, res) => {
    const {testID} = req.body;
    res.json({ message: getToken(testID ?? 0) });
});

// test auth
app.get('/api/me', requireAuth, (req, res) => {
    res.json({
        message: 'You are authenticated',
        user_id: req.user.id,
        email: req.user.email
    })
});

app.use('/api/friends', friendRoute);
app.use('/api/items', itemRoute);

app.listen(PORT, () => {
    console.log(`\n 🟢 Server running on ${PORT}`);
    console.log(`Accepting requests from ${process.env.CLIENT_URL}`);
});
