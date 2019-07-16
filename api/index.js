'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean2', { useNewUrlParser: true },(err,res)=>{
	if(err){
		throw err;
	}else{
        console.log("la base de datos esta corriendo correctamente ...");

        app.listen(port,function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:"+port);
        });
	}
});