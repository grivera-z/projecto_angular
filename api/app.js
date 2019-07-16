'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http


// Rutas base
app.use('/api',user_routes);


module.exports = app;