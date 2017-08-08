var http = require('http');
var app = require('./config/express')();
var db = require('./config/database.js');
var sensitiveData = require('./sensitive-data.js');

http.createServer(app).listen(app.get('port'), 
function(){
    console.log('Servidor rodando em localhost:' + app.get('port'));
});
db(sensitiveData.mongoUri);