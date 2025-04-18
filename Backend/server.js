// This file is the entry point for the server application.

const app = require('./App').getApp();
const connectDatabase = require('./config/Database');
const environment = require('./config/environment');

// Connect to database
connectDatabase();

// Start server
const server = app.listen(environment.port, () => {
  console.log(`Server running on port ${environment.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
