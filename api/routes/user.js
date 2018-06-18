'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});
var api = express.Router();


api.get('/probando-controlador', md_auth.ensureAuth , UserController.pruebas);
api.get('/get-image-file/:imageFile' , UserController.getImageFile);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth,md_upload] , UserController.uploadImage);
api.put('/update-user/:id', md_auth.ensureAuth , UserController.updateUser);

module.exports = api;