const express = require('express');
const authRoutes = require('./routes/authRoutes');
const ErrorMiddleware = require('./middleware/errorMiddleware');

class App {
  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    this.app.use(express.json());
  }

  initializeRoutes() {
    this.app.use('/api/auth', authRoutes);
  }

  initializeErrorHandling() {
    // Handle undefined routes
    this.app.all('*', (req, res, next) => {
      next(ErrorMiddleware.createError(`Can't find ${req.originalUrl} on this server`, 404));
    });

    // Global error handler
    this.app.use(ErrorMiddleware.globalErrorHandler);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App();
