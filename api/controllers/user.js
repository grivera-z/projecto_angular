'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req,res){
    res.status(200).send({
        message:'Probando una accion del controlador de Usuarios del api rest con Node y Mongodb'
    });
}

function saveUser(req,res){
    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //Encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err,hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null ){
                //Guardar en la base de datos
                user.save((err,userStored) => {
                    if(err){
                        res.status(500).send({message:'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message:'No se ha registrado el Usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message:'Rellena todos los campos necesarios'+err});
            }
        });
    }else{
        res.status(200).send({message:'Introduce la contraseña'});
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
                //Comprobar contraseña
                bcrypt.compare(password, user.password, function(err,check){
                    if(check){
                        //Devolver los datos del usuario logueado
                        if(params.gethash){
                            //Devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        //Devolver 404
                        res.status(404).send({message: 'El usuario No ha podido loguearse'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};