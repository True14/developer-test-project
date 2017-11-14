'use strict';

const router = require('express').Router();
const ares = require('../controllers/ares-controllers');

router.get('/tracks', ares.list_all_tracks);

router.get('/tracks/:tracksId', ares.read_a_task);

router.post('/tracks', ares.create_tracks);

router.put('/tracks/:tracksId', ares.update_a_track);

router.delete('/tracks/:tracksId', ares.delete_a_track);

module.exports = {
  router
};
