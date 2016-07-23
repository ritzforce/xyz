'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe.skip('GET /api/exams', function () {

	it('should respond with JSON array', function (done) {
		request(app)
			.get('/api/exams')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				done();
			});
	});
});


describe.skip('GET /api/exams By Id', function () {

	it('should respond with JSON array', function (done) {
		request(app)
			.get('/api/exams/14')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				done();
			});
	});
});

describe.skip('POST /api/exams', function () {
	it('should create a new exam record', function (done) {
		var examBody =  { name: 'Physics', code: 'Phy1' };

		request(app)
			.post('/api/exams')
			.send(examBody)
			.expect(201)
			.end(function (err, res) {
				if(err) return done(err);
				console.log(res.body);
				done();
			});
	});
});

describe.skip('PUT /api/exams/14', function () {
	it('should update an existing exam record', function (done) {
		var examBody =  { name: 'Mathematics', code: 'Math' };

		request(app)
			.put('/api/exams/14')
			.send(examBody)
			.expect(200)
			.end(function (err, res) {
				if(err) return done(err);
				console.log(res.body);
				done();
			});
	});
});

describe.skip('DELETE /api/exams/25', function () {
	it('should update an existing exam record', function (done) {
		
		request(app)
			.delete('/api/exams/25')
			.expect(204)
			.end(function (err, res) {
				if(err) return done(err);
				console.log(res.body);
				done();
			});
	});
});