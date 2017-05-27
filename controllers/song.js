'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec(function(err,song){
		if(err){
			res.status(500).send({message: 'Error en la busqueda de la cancion'});
		}else{
			if(!song){
				res.status(404).send({message: 'La cancion no existe'});
			}else{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req,res){
	var albumId = req.params.album;
	var find;
	if(!albumId){
		find = Song.find({}).sort('number');
	}else{
		find = Song.find({album: albumId}).sort('number');
	}

	//Agregamos los datos del album y del artista
	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'artist'
		}
	}).exec(function(err,songs){
		if(err){
			res.status(500).send({message: 'Error en la busqueda de las canciones'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}

function saveSong(req,res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save(function(err,songStored){
		if(err){
			res.status(500).send({message: 'Error al guardar la cancion'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'No se ha guardado la cancion'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}

function updateSong(req,res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId,update,function(err,songUpdated){
		if(err){
			res.status(500).send({message: 'Error al actualizar la cancion'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha guardado la cancion'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	})
}

function deleteSong(req,res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId,function(err,songRemoved){
		if(err){
			res.status(500).send({message: 'Error al borrar la cancion'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se ha eliminado la cancion'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong
}