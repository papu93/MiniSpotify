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

module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist
}
