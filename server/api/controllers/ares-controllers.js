'use strict';

const mongoose = require('mongoose');
const { Track } = require('../models/ares-models');
mongoose.Promise = global.Promise;

exports.list_all_tracks = (req, res) => {
  Track.find()
    .then(tracks => {
      res.json(tracks.map((track) => {
        return track.apiRepr();
      }));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({error: 'We are sorry, we were unable to retrieve the tracks'});
    });
};

exports.create_tracks = (req, res) => {
  const create = [];
  req.body.tracks.forEach(track => {
    create.push(Track.findOne({mmsid: track.mmsid})
                 .then(track => {
                   if (!track) {
                     return Track.create(track);
                   } else {
                     return Track.findByIDAndUpdate(track.id, {
                       position: track.position,
                       name: track.name,
                       callsign: track.callsign,
                       speed: track.speed,
                       course: track.course,
                       heading: track.heading
                     });
                   }
                 })
               );
  });

  return Promise.all(create)
   .then(results => {
     res.status(200);
   })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Sorry, but there was a problem creating the track(s)'});
    });
};

exports.read_a_task = (req, res) => {
  return Track.findOne({_id: req.params.tracksId})
    .then(track => {
      res.json(track.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Problems retrieving the track'});
    });
};

exports.update_a_track = (req, res) => {
  Track.findByIDAndUpdate(req.params.tracksId, {
    position: req.body.position,
    name: req.body.name,
    callsign: req.body.callsign,
    speed: req.body.speed,
    course: req.body.course,
    heading: req.body.heading
  })
  .then(results => {
    res.status(200);
  })
  .catch(err => {
    res.status(500).json({error: 'Problems updating the track'});
  });
};

exports.delete_a_track = (req, res) => {
  Track.remove({_id: req.params.taskId})
  .then(result => {
    res.status(200);
  })
  .catch(err => {
    res.status(500).json({error: 'Problems removing the track'});
  });
};
