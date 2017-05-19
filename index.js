'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/miniSpotify',function(err, res) {
	if(err) {
		throw err;
	}else{
		console.log("La conexion a la base de datos esta funcionando correctamente...");

		app.listen(port,function() {
			console.log("Servidor del api rest de musica escuchando en http://localhost:"+port);
		})
	}
})