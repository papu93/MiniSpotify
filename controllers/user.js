'use strict'

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con Node y Mongo'
	});	
}

module.exports = {
	pruebas
	//mas metodos
};