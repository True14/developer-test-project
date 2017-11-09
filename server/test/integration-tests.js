'use strict';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer} = require ('../server');
const { TEST_DATABASE_URL } = require('../config');
const Track = require('../api/models/ares-models');
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
    console.log('this is happening');
    return runServer(undefined, TEST_DATABASE_URL);
  });

  after(() => {
    console.log('hello');
    return closeServer();
  });

  afterEach(() => {
    return clearDB();
  });

  describe('GET endpoints', () => {
    describe('/api/tracks', () => {
      it('should return a status of 200', () => {
        let res;
        return chai.request(app).get('/tracks')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
        });
      });
    });
  });
});
