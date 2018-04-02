'user strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
    var params = req.body;
    var artistId = req.params.id;
    Artist.findById(artistId,(err,artist)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({message: 'No existe Artista'});
            }else{
                res.status(200).send({message: artist});
            }
        }
    });
    //res.status(200).send({message: 'Metodo getArtist del controlador Artist.js'});
}

function getArtists(req,res){
    var params = req.body;
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page=1;
    }
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page,itemsPerPage, function(err,artists,total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No existe Artista'});
            }else{
                res.status(200).send({
                    Total_Items: total,
                    artists: artists
                });
            }
        }
    });


}

function saveArtist(req,res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});

        }else{
            if(!artistStored){
                res.status(404).send({message: 'Error al guardar el artista'});
            }else{
                res.status(200).send({message: artistStored});
            }
        }
    });
}

function updateArtist(req,res){
    var artisId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artisId,update,(err,artistUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});

        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'Error al Actualizar el artista'});
            }else{
                res.status(200).send({message: artistUpdated});
            }
        }
    });
    
}

function deleteArtist(req,res){
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId,(err,artistRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al Eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'Error al Eliminar el artista'});
            }else{
                //console.log(artistRemoved);
                res.status(200).send({artistRemoved});
                // Album.find({artist:artistRemoved._id}).remove((err,albumRemoved)=>{
                //     if(err){
                //         res.status(500).send({message: 'Error al Eliminar el album'});
                //     }else{
                //         if(!albumRemoved){
                //             res.status(404).send({message: 'Error al Eliminar el album'});
                //         }else{
                //             //console.log(albumRemoved);
                //             //res.status(200).send({albumRemoved});
                //             Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
                //                 if(err){
                //                     res.status(500).send({message: 'Error al Eliminar la cancion'});
                //                 }else{
                //                     if(!songRemoved){
                //                         res.status(404).send({message: 'Error al Eliminar La cancion'});
                //                     }else{
                //                         console.log(songRemoved);
                //                         res.status(200).send({songRemoved});
                                    
                //                     }
                //                 }
                //             });
                //         }
                //     }
                // });
            }
        }
    });
}

module.exports={
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist
};