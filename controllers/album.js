'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req,res){ 
	var albumId = req.params.id;

	//populate carga los datos del artista que esta asociado al album
	Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=> {
		if(err){
			res.status(500).send({message: 'Error en la busqueda del album'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req,res){
	var artistId = req.params.artist;

	var find;
	if(!artistId){ //Sacar todos los albunes de la BD
		find = Album.find({}).sort('title');
	}else{ 	//Sacar los albums de ese artista
		find = Album.find({artist: artistId}).sort('year');
	}
	find.populate({path: 'artist'}).exec(function(err,albums){
		if(err){
			res.status(500).send({message: 'Error al buscar los albums'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req,res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save(function(err,albumStored){
		if(err){
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function updateAlbum(req,res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, function(err,albumUpdated){
		if(err){
			res.status(500).send({message: 'Error al actualizar el album'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha actualizado el album'});
			}else{
				res.status(200).send({album:albumUpdated});
			}
		}
	});
}

function deleteAlbum(req,res){
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, function(err,albumRemoved){
		if(err){
			res.status(500).send({message: 'Error al eliminar el album'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});
			}else{
				Song.find({album: albumRemoved._id}).remove(function(err,songRemoved){
					if(err){
						res.status(500).send({message: 'Error al eliminar la cancion'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'La cancion no ha sido eliminado'});
						}else{
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req,res){
//Metodo para subir ficheros
	var albumId = req.params.id; 
	var file_name = 'Imagen no subida'; //por defecto

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/'); //recortar la direc de la img
		var file_name = file_split[2]; //elegimos solo el nombre

		var ext_split = file_name.split('.'); //separo el nombre de la extension
		var file_ext = ext_split[1]; //me quedo con la extension

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Album.findByIdAndUpdate(albumId, {image: file_name},(err,albumUpdated) => {
				if(err){
					res.status(500).send({message:'Error al actualizar la imagen'});
				}else{
					if(!albumUpdated){
						res.status(404).send({message:'No se ha podido actualizar el album'});
					}else{
						res.status(200).send({album: albumUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message: 'Extension del archivo invalida'});
		}
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile; //obtengo nombre de la imagen solicitada
	var path_file = './uploads/albums/'+imageFile; //agrego la ruta
	
	fs.exists(path_file,function(exists){ 
		if(exists){ 
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}
