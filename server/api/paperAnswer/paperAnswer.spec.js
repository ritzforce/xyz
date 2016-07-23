'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe.skip('POST /api/paperAnswers', function() {

  it('Check should upsert a Paper Answer record', function(done) {
    request(app)
      .post('/api/paperAnswers')
      .send({paperId: 2, questionId: 4, answer: 'a'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});