const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './src/index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, './src/index.html')));
app.get('/todo.html', (req, res) => res.sendFile(path.join(__dirname, './src/todo.html')));
app.get('/notes.html', (req, res) => res.sendFile(path.join(__dirname, './src/notes.html')));
app.get('/pomodoro.html', (req, res) => res.sendFile(path.join(__dirname, './src/pomodoro.html')));
app.get('/feedback.html', (req, res) => res.sendFile(path.join(__dirname, './src/feedback.html')));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));