'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe.skip('GET /api/papers', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/papers')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});


describe.skip('GET /api/paper/result', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/papers/result/2')
      .expect(200)
      //.expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log('****RESPONSE***');
        console.log(res);
        
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});