let multiparty = require('multiparty');
let fs = require('fs');

let File = require('../models/file.model.js');

module.exports.uploadFile = function(req, res){
  let form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    if (files){
      let uploadedFile = files.file[0];
      let contentType = uploadedFile.headers['content-type'];
      let fileToSave;
      if (contentType == 'audio/mp3'){
        let dashIndex = uploadedFile.originalFilename.indexOf("-");
        let filename = uploadedFile.originalFilename.substr(0, dashIndex);
        let duration = uploadedFile.originalFilename.substr(dashIndex + 1);
        fileToSave = new File({
          filename: filename,
          contentType: contentType,
          creationDate: Date.now(),
          binaryData: fs.readFileSync(uploadedFile.path),
          audioDuration: duration
        });
      } else if (contentType == 'image/jpeg'){
        let filename = uploadedFile.originalFilename;
        fileToSave = new File({
          filename: filename,
          contentType: contentType,
          creationDate: Date.now(),
          binaryData: fs.readFileSync(uploadedFile.path)
        });
      };
      fs.unlink(uploadedFile.path);
      let searchByFileName = File.findOne({filename:fileToSave.filename}).then(
        function(file){
          if (file){
            res.status(200).json({_id:file._id, filename:file.filename, contentType:file.contentType, creationDate:file.creationDate, audioDuration:file.audioDuration});
          } else {
            let fileCreation = File.create(fileToSave).then(
              function(file){
                res.status(201).json({_id:file._id, filename:file.filename, contentType:file.contentType, creationDate:file.creationDate, audioDuration:file.audioDuration});
              },
              function(error){
                res.status(500).json(error);
              }
            )
          }
        },
        function(error){
          res.status(500).json(error);
        }
      )
    } else {
      res.status(400).json({'error':'bad request'});
    }
  });
}

module.exports.getFile = function(req, res){
  let fileId = req.params.fileId;
  let promise = File.findOne({_id:fileId}).exec();
  promise.then(
    function(file){
      if (file){
        res.setHeader('content-type', file.contentType);
        res.send(file.binaryData);
      } else {
        res.status(404).json({'error':'notFound'});
      }
    },
    function(e){
      res.status(500).json(e);
    }
  )
}

module.exports.getFileMeta = function(req, res){
  let fileId = req.params.fileId;
  File.findOne({_id:fileId}).exec().then(
    function(file){
      file.toObject();
      let meta = {
        _id: file._id,
        filename: file.filename,
        contentType: file.contentType,
        creationDate: file.creationDate,
      };
      if (file.audioDuration){
        meta.audioDuration = file.audioDuration;
      };
      res.status(200).json(meta);
    },
    function(error){
      res.status(500).json(error);
    }
  )
}