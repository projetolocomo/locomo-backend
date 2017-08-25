let FileController = require('./file.controller.js');
let UserMap = require('../models/map.model.js');
let File = require('../models/file.model.js');

module.exports.createMap = function(req, res){
  console.log(req.body)
  if (req.body._id){
    let map = {
      name: req.body.name,
      textualDescription: req.body.textualDescription,
      voiceDescription: req.body.voiceDescription
    };
    if (req.body.previousVoiceDescription){
      console.log('removing ' + req.body.previousVoiceDescription);
      let previousVoiceDescription = req.body.previousVoiceDescription;
      File.findByIdAndRemove({_id:previousVoiceDescription}).exec();
    }
    let mapId = req.body._id;
    let updateMap = UserMap.findOneAndUpdate({_id:mapId}, map, {upsert:true}).exec().then(
      function(success){
        let promise = UserMap.findOne({_id:mapId}).exec().then(
          function(map){
            res.status(200).json(map);
          },
          function(error){
            res.status(500).json(error);
          }
        )
      },
      function(error){
        console.log(error)
        res.status(500).json(error);
      }
    )
  } else {
    let map = new UserMap({
      name: req.body.name,
      textualDescription: req.body.textualDescription,
      voiceDescription: req.body.voiceDescription,
      creationDate: Date.now(),
      userId: req.params.userId
    });
    let mapCreationPromise = UserMap.create(map);
    mapCreationPromise.then(
      function(map){
        res.status(201).json(map);
      },
      function(error){
        res.status(500).json(error);
      }
    )
  }
}

module.exports.deleteMap = function(req, res){
  let mapId = req.body._id;
  let voiceDescription = req.body.voiceDescription;
  if (voiceDescription) {
    File.findByIdAndRemove({_id:voiceDescription}).exec();
  }
  let mapRemovalPromise = UserMap.findByIdAndRemove({_id:mapId}).exec().then(
    function(success){
      res.status(200).json({"ok":"removed successfully"});
    },
    function(error){
      res.status(500).json(error);
    }
  )
};

module.exports.getUserMaps = function(req, res){
  let userId = req.params.userId;
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