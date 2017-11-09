'use strict';
module.exports = (app) => {
  const ares = require('../controllers/ares-controllers');

  app.route('/api/tracks')
    .get(ares.list_all_tracks)
    .post(ares.create_tracks);

  app.route('/api/tracks/:tracksId')
     .get(ares.read_a_task)
     .put(ares.update_a_track)
     .delete(ares.delete_a_track);
};
