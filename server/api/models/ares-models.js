'use strict';

const mongoose = require('mongoose');
const trackSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
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
    latitude: this.latitude,
    longitude: this.longitude,
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
