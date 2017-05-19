'use strict'

var mongoose = require('require');
var schema = mongoose.Schema;

var userSchema = schema ({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

module.exports = mongoose.model('user',userSchema);