let UserMap = require('../models/map.model.js');

module.exports.createMap = function(req, res){
  let map = new UserMap({
    name: req.body.name,
    textualDescription: req.body.textualDescription,
    creationDate: Date.now(),
    userId: req.params.userId
  })
  let promise = UserMap.create(map);
  promise.then(
    function(map){
      res.status(201).json({id:map._id});
    },
    function(error){
      res.status(500).json(error);
    }
  )
}

module.exports.getUserMaps = function(req, res){
  let userId = req.params.id;
  let promise = UserMap.find({userId:userId}).exec();
  promise.then(
    function(map){
      res.status(200).json(map);
    },
    function(error){
      res.status(500).json(error);
    }
  )
}