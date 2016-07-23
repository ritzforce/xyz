'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user');

/*
var user = new User({
	provider: 'local',
	name: 'Fake User',
	email: 'test@test.com',
	password: 'password'
});
*/

describe('Check object assing functionality',function(){
	it("Check object assign",function(){
		var user = new User();
		var objectAssign = require('object-assign');

		var usr = objectAssign(user,{email:'r@r.com',salt:'11'});
		usr.authenticate('blank');
	});
})



/*
describe('User Model', function () {
	before(function (done) {
		// Clear users before testing
		User.remove().exec().then(function () {
			done();
		});
	});

	afterEach(function (done) {
		User.remove().exec().then(function () {
			done();
		});
	});

	it('should begin with no users', function (done) {
		User.find({}, function (err, users) {
			users.should.have.length(0);
			done();
		});
	});

	it('should fail when saving a duplicate user', function (done) {
		user.save(function () {
			var userDup = new User(user);
			userDup.save(function (err) {
				should.exist(err);
				done();
			});
		});
	});

	it('should fail when saving without an email', function (done) {
		user.email = '';
		user.save(function (err) {
			should.exist(err);
			done();
		});
	});

	it("should authenticate user if password is valid", function () {
		return user.authenticate('password').should.be.true;
	});

	it("should not authenticate user if password is invalid", function () {
		return user.authenticate('blah').should.not.be.true;
	});

});
*/
