var mongoose = require('mongoose');

module.exports = function(uri){
    mongoose.connect(uri);
    mongoose.connection.on('connected', function(){
        console.log('Mongoose conectado em ' + uri);
    });
    mongoose.connection.on('disconnected', function(){
        console.log('Mongoose desconectado de ' + uri);
    });
    mongoose.connection.on('error', function(error){
        console.log('Erro na conexão do Mongoose: ' + error);
    });
    mongoose.set('debug', true);
}