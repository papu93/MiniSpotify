'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){ 
	//Busca un artista dado un ID
	var artistId = req.params.id;

	Artist.findById(artistId,(err,artist) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message:'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}

function getArtists(req,res){
	//Devuelve los artistas en paginas
	var page; 
	if(req.params.page){ //este valor es opcional por lo tanto:
		page = req.params.page;
	}else{
		page = 1;
	}
	var itemsPerPage = 2; 

	//la funcion sort ordena los jugadores por un atributo
	//la funcion paginate configura los items en las paginnas
	Artist.find().sort('name').paginate(page,itemsPerPage,function(err,artists,totalItems){
		if(err){
			res.status(500).send({message:'Error en la peticion'});
		}else{
			if(!artists){
				res.status(404).send({message:'No hay artistas'});
			}else{
				return res.status(200).send({
					total_Items: totalItems,
					artists: artists
				});
			}

		}
	});
}

function saveArtist(req,res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err,artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'No se ha guardado el artista'});			
			}else{
				res.status(200).send({artist: artistStored});
			}	
		}
	});
}

function updateArtist(req,res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId,update,function(err,artistUpdated){
		if(err){
			res.status(500).send({message:'Error al modificar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message:'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req,res){
//Eliminar un artista dado el id, sus albunes y canciones
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, function(err,artistRemoved){
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				Album.find({artist: artistRemoved._id}).remove(function(err,albumRemoved){
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
									res.status(200).send({artist: artistRemoved});
								}
							}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req,res){
//Metodo para subir ficheros
	var artistId = req.params.id; 
	var file_name = 'Imagen no subida'; //por defecto

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/'); //recortar la direc de la img
		var file_name = file_split[2]; //elegimos solo el nombre

		var ext_split = file_name.split('.'); //separo el nombre de la extension
		var file_ext = ext_split[1]; //me quedo con la extension

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name},(err,artistUpdated) => {
				if(err){
					res.status(500).send({message:'Error al actualizar la imagen'});
				}else{
					if(!artistUpdated){
						res.status(404).send({message:'No se ha podido actualizar el artista'});
					}else{
						res.status(200).send({user: artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile; //agrego la ruta
	
	fs.exists(path_file,function(exists){ 
		if(exists){ 
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}
