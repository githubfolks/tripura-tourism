const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the homepage
// Serve the homepage
// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

// Route for About Us page
app.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about-us.html'));
});

// Serve the destinations page
app.get('/destinations', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'destinations.html'));
});

// Route for Experiences page
app.get('/experiences', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'experiences.html'));
});

// Route for Events page
app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'events.html'));
});

// Route for Event Details page
app.get('/event-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'event-details.html'));
});

// Route for Planner page
app.get('/planner', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'planner.html'));
});

// Route for Booking page
app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'booking.html'));
});

// Route for Contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
