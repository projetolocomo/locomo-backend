let FileController = require('./file.controller.js');
let UserMap = require('../models/map.model.js');
let File = require('../models/file.model.js');
let Marker = require('../models/marker.model.js');

module.exports.createMap = function(req, res){
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
    UserMap.findOneAndUpdate({_id:mapId}, map, {upsert:true}).exec().then(
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
        console.log(error);
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
    UserMap.create(map).then(
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
    console.log("removing map voice description");
    File.findByIdAndRemove({_id:voiceDescription}).exec();
  }
  Marker.find({'properties.mapId':mapId}).lean().exec().then(
    function(markers){
      // remover os marcadores e os arquivos deles pra depois remover o mapa
      console.log("found markers: " + markers.length);      
      for (i = 0; i < markers.length; i++) {
        console.log(markers[i]._id);
        Marker.findOne({_id:markers[i]._id}).lean().exec().then(
          function(marker){
            if (marker.properties.pictureId){
              console.log("removing picture " + marker.properties.pictureId);
              File.findByIdAndRemove({_id:marker.properties.pictureId}).exec();
            }
            if (marker.properties.voiceDescriptionId){
              console.log("removing voice description " + marker.properties.voiceDescriptionId);
              File.findByIdAndRemove({_id:marker.properties.voiceDescriptionId}).exec();
            }
          },
          function(error){
            console.log("mapController.deleteMap(): error while deleting markers files");
            res.status(500).json(error);
          }
        )
        Marker.findByIdAndRemove({_id:markers[i]._id}).exec();
        console.log("removed marker " + markers[i]._id);
      }
      UserMap.findByIdAndRemove({_id:mapId}).exec().then(
        function(success){
          res.status(200).json({"ok":"removed successfully"});
        },
        function(error){
          console.log("mapController.deleteMap(): error while deleting map");
          res.status(500).json(error);
        }
      )
    },
    function(error){
      console.log("mapController.deleteMap(): map not found");
      res.status(500).json(error);
    }
  )
};

module.exports.getUserMaps = function(req, res){
  let userId = req.params.userId;
  UserMap.find({userId:userId}).exec().then(
    function(maps){
      res.status(200).json(maps);
    },
    function(error){
      res.status(500).json(error);
    }
  )
}