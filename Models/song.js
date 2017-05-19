'use strict'

var mongoose = require('require');
var schema = mongoose.Schema;

var songSchema = schema ({
	number: String,
	name: String,
	duration: String,
	file: String,	
	album: {type: Schema.ObjectId, ref: 'album'}

});

module.exports = mongoose.model('song',songSchema);