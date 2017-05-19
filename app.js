'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar RUTAS

app.use(bodyParser.urlencoded({extended:false})); //Necesario para q bodyParser ande
app.use(bodyParser.json()); //convierto a obj JSON lo que viene en las peticiones

//configurar cabeceras HTTP

//rutas base

app.get('/pruebas',function(req,res){
	res.status(200).send({message:'Flaca petera'});
});

module.exports = app;