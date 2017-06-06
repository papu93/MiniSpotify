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

function uploadFile(req,res){
//Metodo para subir ficheros
	var songId = req.params.id; 
	var file_name = 'Cancion no subida'; //por defecto

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('/'); //recortar la direc de la img
		var file_name = file_split[2]; //elegimos solo el nombre

		var ext_split = file_name.split('.'); //separo el nombre de la extension
		var file_ext = ext_split[1]; //me quedo con la extension

		if(file_ext == 'mp3' || file_ext == 'ogg'){
			Song.findByIdAndUpdate(songId, {file: file_name},(err,songUpdated) => {
				if(err){
					res.status(500).send({message:'Error al actuaizar la cancion'});
				}else{
					if(!songUpdated){
						res.status(404).send({message:'No se ha podido actualizar la cancion'});
					}else{
						res.status(200).send({song: songUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message: 'Extension del archivo invalida'});
		}
	}else{
		res.status(200).send({message: 'No has subido ninguna cancion'});
	}
}

function getSongFile(req, res){
	var songFile = req.params.songFile; //obtengo nombre de la imagen solicitada
	var path_file = './uploads/songs/'+songFile; //agrego la ruta
	
	fs.exists(path_file,function(exists){ 
		if(exists){ 
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la cancion'});
		}
	});
}


module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}