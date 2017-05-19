'use strict'

var mongoose = require('require');
var schema = mongoose.Schema;

var albumSchema = schema ({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'artist'}
});

module.exports = mongoose.model('album',albumSchema);