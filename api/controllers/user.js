'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/users');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con Node y Mongo'
	});	
}

function saveUser(req, res){
	var user = new User();

	var params = req.body; //Param que lleguen por POST

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contrasena y guardar dato
		bcrypt.hash(params.password, null, null, function(err,hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Guardar usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(400).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user:userStored});
						}
					}
				}); 
			}else{
				res.status(200).send({message: 'Rellena todos los campos'});
			}
		});
	}else{
		res.status(500).send({message: 'Introduce la contrasena'});
	}
}

function loginUser(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err,user) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//comprobar la contrasena
				bcrypt.compare(password,user.password, function(err,check){
					if(check){
						//devolver datos de usuario logueado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							})
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'La contrasena es incorrecta'});
					}
				});
			}
		}
	})
}

function updateUser(req,res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub) { //Comparo el id con el id que esta en el token que se decodifica
		return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId,update,(err,userUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req,res){
//Metodo para subir ficheros
	var userId = req.params.id; 
	var file_name = 'Imagen no subida'; //por defecto

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/'); //recortar la direc de la img
		var file_name = file_split[2]; //elegimos solo el nombre

		var ext_split = file_name.split('.'); //separo el nombre de la extension
		var file_ext = ext_split[1]; //me quedo con la extension

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(userId, {image: file_name},(err,userUpdated) => {
				if(err){
					res.status(500).send({message:'Error al actualizar la imagen'});
				}else{
					if(!userUpdated){
						res.status(404).send({message:'No se ha podido actualizar el usuario'});
					}else{
						res.status(200).send({image: file_name, user: userUpdated});
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
	var path_file = './uploads/users/'+imageFile; //agrego la ruta
	
	fs.exists(path_file,function(exists){ 
		if(exists){ 
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
	//mas metodos
};