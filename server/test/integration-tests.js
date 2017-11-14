'use strict';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require ('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Track }  = require('../api/models/ares-models');
const mongoose = require('mongoose');
const should = chai.should();

chai.use(chaiHttp);

const testData = [
  {
    name : 'TUG.NEPTUNE',
    position : {
      latitude : 31.1045283333333,
      longitude : -81.4499016666667,
    },
    callsign : 'WCT5064',
    mmsid : '368542000',
    speed : 12.6,
    course : 134.8,
    heading : 159.6,
  },
  {
    name : 'AS FABRIZIA',
    position : {
      latitude : 30.6796166666667,
      longitude : -80.16415,
    },
    callsign : 'CQIU3',
    mmsid : '255806069',
    speed : 12.2,
    course : 175.1,
    heading : 173,
  }
];

const testOne = testData[0];
const testTwo = testData[1];
const updateData = {
  name : 'TUG.PLUTO',
  position : {
    latitude : 55.1045285555555,
    longitude : -81.4499016666667,
  },
  callsign : 'TEST',
  mmsid : '368542000',
  speed : 5,
  course : 5,
  heading : 5,
};
const clearDB = () => {
  return mongoose.connection.dropDatabase();
};

describe('Ares-Test-Project', () => {
  before(() => {
    return runServer(undefined, TEST_DATABASE_URL);
  });

  after(() => {
    return clearDB().then(() => closeServer());
  });

  afterEach(() => {
    console.log('clearing db');
    return clearDB();
  });

  describe('GET endpoints', () => {
    describe('/tracks', () => {
      it('should return a status of 200', () => {
        return chai.request(app).get('/api/tracks')
          .then(_res => {
            _res.should.be.json;
            _res.should.have.status(200);
          });
      });

      it('should return all of the tracks in the database with correct data', () => {
        let res;
        return Track.insertMany(testData)
          .then(_res => {
            return chai.request(app).get('/api/tracks');
          })
          .then(_res => {
            res = _res;
            res.body.should.be.a('array');
            res.body.should.have.length.of.at.least(2);
            res.body.forEach(track => {
              track.should.have.property('position').which.is.a('object');
              track.position.should.have.property('latitude').which.is.a('number');
              track.position.should.have.property('longitude').which.is.a('number');
              track.should.have.property('name').which.is.a('string');
              track.should.have.property('callsign').which.is.a('string');
              track.should.have.property('mmsid').which.is.a('string');
              track.should.have.property('speed').which.is.a('number');
              track.should.have.property('course').which.is.a('number');
              track.should.have.property('heading').which.is.a('number');
            });
          });
      });

    });

    describe('/tracks/:tracksId', () => {
      it('should retrieve the correct track', () => {
        let res;
        return Track.insertMany(testData)
          .then(_res => {
            res = _res;
            return chai.request(app).get(`/api/tracks/${res[0]._id}`);
          })
          .then(_res => {
            let track = _res.body;
            res = res[0];

            _res.should.be.json;
            _res.should.have.status(200);
            track.should.be.an('object');
            track.id.should.equal(res._id.toString());
            track.should.have.property('position').which.is.a('object');
            track.position.should.have.property('latitude').which.is.a('number');
            track.position.latitude.should.equal(res.position.latitude);
            track.position.should.have.property('longitude').which.is.a('number');
            track.position.longitude.should.equal(res.position.longitude);
            track.should.have.property('name').which.is.a('string');
            track.name.should.equal(res.name);
            track.should.have.property('callsign').which.is.a('string');
            track.callsign.should.equal(res.callsign);
            track.should.have.property('mmsid').which.is.a('string');
            track.mmsid.should.equal(res.mmsid);
            track.should.have.property('speed').which.is.a('number');
            track.speed.should.equal(res.speed);
            track.should.have.property('course').which.is.a('number');
            track.course.should.equal(res.course);
            track.should.have.property('heading').which.is.a('number');
            track.heading.should.equal(res.heading);
          });
      });
    });

  });

  describe('PUT endpoints', () => {

    describe('/tracks/:tracksId', () => {
      let res;

      it('should update a track', () => {
        return Track.insertMany(testData)
          .then(_res => {
            res = _res;
            return chai.request(app).put(`/api/tracks/${res[0]._id}`)
              .send(updateData);
          })
          .then(_res => {
            let track = _res.body;
            res = res[0];

            _res.should.be.json;
            _res.should.have.status(200);
            track.should.be.an('object');
            track.id.should.equal(res._id.toString());
            track.should.have.property('position').which.is.a('object');
            track.position.should.have.property('latitude').which.is.a('number');
            track.position.latitude.should.equal(updateData.position.latitude);
            track.position.should.have.property('longitude').which.is.a('number');
            track.position.longitude.should.equal(updateData.position.longitude);
            track.should.have.property('name').which.is.a('string');
            track.name.should.equal(updateData.name);
            track.should.have.property('callsign').which.is.a('string');
            track.callsign.should.equal(updateData.callsign);
            track.should.have.property('mmsid').which.is.a('string');
            track.mmsid.should.equal(updateData.mmsid);
            track.should.have.property('speed').which.is.a('number');
            track.speed.should.equal(updateData.speed);
            track.should.have.property('course').which.is.a('number');
            track.course.should.equal(updateData.course);
            track.should.have.property('heading').which.is.a('number');
            track.heading.should.equal(updateData.heading);
          });
      });

    });

  });

  describe('POST endpoints', () => {

    describe('/api/tracks', () => {

      it('Should add tracks to the database', () => {
        return chai.request(app).post('/api/tracks')
          .send(testData)
          .then(_res => {
            let tracks = _res.body;

            _res.should.be.json;
            _res.should.have.status(200);
            tracks.forEach((track, index) => {
              track.should.be.an('object');
              track.should.have.property('id').which.is.a('string');
              track.should.have.property('position').which.is.a('object');
              track.position.should.have.property('latitude').which.is.a('number');
              track.position.latitude.should.equal(testData[index].position.latitude);
              track.position.should.have.property('longitude').which.is.a('number');
              track.position.longitude.should.equal(testData[index].position.longitude);
              track.should.have.property('name').which.is.a('string');
              track.name.should.equal(testData[index].name);
              track.should.have.property('callsign').which.is.a('string');
              track.callsign.should.equal(testData[index].callsign);
              track.should.have.property('mmsid').which.is.a('string');
              track.mmsid.should.equal(testData[index].mmsid);
              track.should.have.property('speed').which.is.a('number');
              track.speed.should.equal(testData[index].speed);
              track.should.have.property('course').which.is.a('number');
              track.course.should.equal(testData[index].course);
              track.should.have.property('heading').which.is.a('number');
              track.heading.should.equal(testData[index].heading);
            });
          });
      });

      it('Should update when track already exists', () => {
        const newTestData = testData.slice();
        newTestData[2] = updateData
        let res;
        return chai.request(app).post('/api/tracks')
          .send(newTestData)
          .then(_res => {
            res = _res.body;
            let track = res[0];
            _res.should.be.json;
            _res.should.have.status(200);
            res.should.have.length(2);
            res.should.be.an('array');
            track.should.be.an('object');
            track.should.have.property('id').which.is.a('string');
            track.should.have.property('position').which.is.a('object');
            track.position.should.have.property('latitude').which.is.a('number');
            track.position.latitude.should.equal(updateData.position.latitude);
            track.position.should.have.property('longitude').which.is.a('number');
            track.position.longitude.should.equal(updateData.position.longitude);
            track.should.have.property('name').which.is.a('string');
            track.name.should.equal(updateData.name);
            track.should.have.property('callsign').which.is.a('string');
            track.callsign.should.equal(updateData.callsign);
            track.should.have.property('mmsid').which.is.a('string');
            track.mmsid.should.equal(updateData.mmsid);
            track.should.have.property('speed').which.is.a('number');
            track.speed.should.equal(updateData.speed);
            track.should.have.property('course').which.is.a('number');
            track.course.should.equal(updateData.course);
            track.should.have.property('heading').which.is.a('number');
            track.heading.should.equal(updateData.heading);
          });
      });

    });

  });

  describe('DELETE endpoints', () => {

    describe('/api/tracks/:tracksId', () => {
      it('should remove a track', () => {
        let res;
        return Track.insertMany(testData)
        .then(_res => {
          res = _res[0];
          return chai.request(app).delete(`/api/tracks/${res._id}`);
        })
        .then(() => {
          return Track.find();
        })
        .then(_res => {
          _res.should.be.an('array');
          _res.should.have.length(1);
          _res[0].name.should.equal(testData[1].name);
        });
      });
    });
  });

});
