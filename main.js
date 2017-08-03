var http = require('http');
var app = require('./config/express')();
var db = require('./config/database.js');
var uri = require('./uri.js');

var uriAddress = uri.getUri();

http.createServer(app).listen(app.get('port'), 
function(){
    console.log('Servidor rodando em localhost:' + app.get('port'));
});
db('uriAddress');