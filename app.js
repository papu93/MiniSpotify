'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar RUTAS
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false})); //Necesario para q bodyParser ande
app.use(bodyParser.json()); //convierto a obj JSON lo que viene en las peticiones

//configurar cabeceras HTTP

//rutas base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes)

module.exports = app;