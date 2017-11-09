'use strict';
module.exports = (app) => {
  const ares = require('../controllers/ares-controllers');

  app.route('/tracks')
    .get(ares.list_all_tracks)
    .post(ares.create_tracks);

  app.route('/tracks/:tracksId')
     .get(ares.read_a_task)
     .put(ares.update_a_track)
     .delete(ares.delete_a_track);
};
