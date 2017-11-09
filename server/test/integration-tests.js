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
const testThree = testData[2];
const clearDB = () => {
  return mongoose.connection.dropDatabase();
};

describe('Ares-Test-Project', () => {
  before(() => {
    return runServer(undefined, TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  afterEach(() => {
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
              track.should.have.property('position');
              track.should.have.property('name');
              track.should.have.property('callsign');
              track.should.have.property('mmsid');
              track.should.have.property('speed');
              track.should.have.property('course');
              track.should.have.property('heading');
            })
          });
      });
    });
  });
});
