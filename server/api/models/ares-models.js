'use strict';

const mongoose = require('mongoose');
const trackSchema = mongoose.Schema({
  position: {
    latitude: Number,
    longitude: Number
  },
  name: String,
  callsign: String,
  mmsid: String,
  speed: Number,
  course: Number,
  heading: Number
});

trackSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    position: this.position,
    name: this.name,
    callsign: this.callsign,
    mmsid: this.mmsid,
    speed: this.speed,
    course: this.course,
    heading: this.heading
  };
};

const Track = mongoose.model('Track', trackSchema);

module.exports = { Track };
