'use strict'

var mongoose = require('require');
var schema = mongoose.Schema;

var artistSchema = schema ({
	name: String,
	description: String,
	image: String
});

module.exports = mongoose.model('artist',artistSchema);