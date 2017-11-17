'use strict';
const mongoose = require('mongoose');
const Task = require('./api/models/ares-models');
const bodyParser = require('body-parser');
const express = require('express');
const {  DATABASE_URL, PORT } = require('./config');
const { router } = require('./api/routes/ares-routes');
const app = express();
let server;

app.use(bodyParser.json());
app.use('/api', router);
mongoose.Promise = global.Promise;


const runServer = (port = PORT, database = DATABASE_URL) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(database, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
};

const closeServer = () => {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};
if (require.main === module) {
  runServer();
}

module.exports = {
  app,
  runServer,
  closeServer
};
