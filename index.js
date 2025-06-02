
const express = require('express');
const http = require('http');
const cors = require('cors');
const expressFileUpload = require("express-fileupload");
const path = require('path');
const socketIo = require('socket.io');  // Add socket.io
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

// Enable CORS for your React app
const corsOptions = {
  origin: "http://localhost:5173", // Adjust based on your React app's URL
  credentials: true,
};

app.use(cors(corsOptions));  // Applying CORS middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  responseOnLimit: 'File size limit reached',
}));


app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const Routes = require('./routes');
app.use('/', Routes);

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Attach io to app so we can access it in routes (if necessary)
app.set('io', io);

// Socket connection logic
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);
  
  // You can add events here for listening and emitting data
  // Example: socket.emit('message', { msg: "Hello from server!" });
});

// Start the server
const port = 4001;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`✅ Server is running at http://${host}:${port}`);
});

