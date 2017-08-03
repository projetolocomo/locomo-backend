var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');

var userRoutes = require('../app/routes/user.routes.js');
var mapRoutes = require('../app/routes/map.routes.js');

module.exports = function(){
    var app = express();

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.sendStatus(200);
        }
        else {
          next();
        }
	};

    app.use(cors({ origin: true, credentials: true }))
    app.options(cors({ origin: true, credentials: true }))

    app.set('port', 3000);
    // app.use(express.static('./assets'));
    // app.use(express.static('./public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));

    userRoutes(app);
    mapRoutes(app);

    // app.get('*', (req, res) => {
    //     res.sendfile(path.join(__dirname, '../public/index.html'));
    // });
    return app;

}