'use strict';
const mongoose = require('mongoose');
const Task = require('./api/models/ares-models');
const bodyParser = require('body-parser');
const express = require('express');
const {  DATABASE_URL, PORT } = require('./config');
const routes = require('./api/routes/ares-routes');
const app = express();
let server;

routes(app);
mongoose.Promise = global.Promise;
app.use(bodyParser.json());

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

module.exports = {
  app,
  runServer,
  closeServer
};
