'use strict';
const mongoose = require('mongoose');
const Task = require('./api/models/ares-models');
const bodyParser = require('body-parser');
const express = require('express');
const {  DATABASE_URL, PORT } = require('./config');
const app = express();
const routes = require('./api/routes/ares-routes');

routes(app);
mongoose.Promise = global.Promise;
app.use(bodyParser.json());


app.listen(PORT);

console.log('server listening on: ' + PORT);
