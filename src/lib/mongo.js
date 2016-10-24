const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log('process.env.MONGODB_URI: ', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
  throw err;
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = mongoose.connection;
