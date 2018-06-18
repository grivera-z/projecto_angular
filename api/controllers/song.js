'user strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
    var songId = req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error getting the Song'});
        }else{
            if(!song){
                res.status(404).send({message: 'The song dont exist'});
            }else{
                res.status(200).send({song});
            }
        }
    });
    //res.status(200).send({message: 'Funciono  cancion'});
}

function getSongs(req,res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album:albumId}).sort('number');
    }

    find.populate({
        path:'album',
        populate:{
            path:'artist',
            model:'Artist'
        }
    }).exec((err,songs)=>{
        if(err){
            res.status(500).send({message: 'Error getting the Song'});
        }else{
            if(!songs){
                res.status(404).send({message: 'The songs dont exist'});
            }else{
                res.status(200).send({songs});
            }
        }
    });

    //res.status(200).send({message: 'Funciono  cancion'});
}


function saveSong(req,res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar Song'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'Error al guardar Song'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });


}

function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update,(err,songUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar Song'});
        }else{
            if(!songUpdate){
                res.status(404).send({message: 'Error al guardar Song'});
            }else{
                res.status(200).send({song: songUpdate});
            }
        }
    });

}

function deleteSong(req,res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId,(err,songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Petition Error'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'Error al remove Song'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });

}

function uploadFile(req,res){
    var songId = req.params.id;
    var file_name = 'no subido.... ';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId,{file:file_name},(err,songUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar Song'});
                }else{
                    if(!songUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el Artista'});
                    }else{
                        res.status(200).send({file: songUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Extencion del archivo no valida'});
        }
        console.log(file_split);
    }else{
        res.status(200).send({message: 'No has subido ningun archivo ... '});
    }
}

function getsongFile(req,res){
    var songFile = req.params.songFile;
    var path_file ='./uploads/songs/' + songFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la Song....'});
        }
    });

}



module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getsongFile
}