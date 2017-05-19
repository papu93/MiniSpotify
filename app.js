'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar RUTAS
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false})); //Necesario para q bodyParser ande
app.use(bodyParser.json()); //convierto a obj JSON lo que viene en las peticiones

//configurar cabeceras HTTP

//rutas base
app.use('/api',user_routes);

module.exports = app;