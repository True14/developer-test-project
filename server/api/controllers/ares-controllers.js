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
  const check = track => {
    return Track.findOne({ mmsid: track.mmsid })
    .then(resultTrack => {
      if (!resultTrack) {
        return Track.create(track);
      } else {
        return Track.findByIdAndUpdate(resultTrack.id, {
          position: track.position,
          name: track.name,
          callsign: track.callsign,
          speed: track.speed,
          course: track.course,
          heading: track.heading
        }, {new: true});
      }
    });
  };
  const chain = req.body.reduce((previous, track) => {
    return previous.then(() => {
      if (!track.mmsid) {
        try {
          throw new Error('Whoops!');
        } catch (e) {
          console.log(e.name + ': ' + e.message);
        }
      }
      return check(track);
    });
  }, Promise.resolve());

  return chain
  .then(results => {
    return Track.find();
  })
  .then(results => {
    res.status(200).json(results.map(track => {
      return track.apiRepr();
    }));
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
  return Track.findByIdAndUpdate(req.params.tracksId, {
    position: req.body.position,
    name: req.body.name,
    callsign: req.body.callsign,
    speed: req.body.speed,
    course: req.body.course,
    heading: req.body.heading
  }, {new: true})
  .then(results => {
    res.status(200).json(results.apiRepr());
  })
  .catch(err => {
    res.status(500).json({error: 'Problems updating the track'});
  });
};

exports.delete_a_track = (req, res) => {
  return Track.remove({_id: req.params.tracksId}, (err, numberRemoved) => {
    return numberRemoved;
  })
  .then(result => {
    // console.log('this is the result', result);
    res.status(200).json();
  })
  .catch(err => {
    res.status(500).json({error: 'Problems removing the track'});
  });
};
