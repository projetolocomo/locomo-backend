let multiparty = require('multiparty');
let fs = require('fs');
let File = require('../models/file.model.js');

module.exports.uploadFile = function(req, res){
  let form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    let uploadedFile = files.file[0];
    let dashIndex = uploadedFile.originalFilename.indexOf("-");
    let filename = uploadedFile.originalFilename.substr(0, dashIndex);
    let duration = uploadedFile.originalFilename.substr(dashIndex + 1);
    let fileToSave = new File({
      filename: filename,
      contentType: uploadedFile.headers["content-type"],
      creationDate: Date.now(),
      binaryData: fs.readFileSync(uploadedFile.path),
      audioDuration: duration
    });
    fs.unlink(uploadedFile.path);
    let fileCreationPromise = File.create(fileToSave);
    fileCreationPromise.then(
      function(file){
        res.status(201).json({_id:file._id, filename:file.filename, contentType:file.contentType, creationDate:file.creationDate, audioDuration:file.audioDuration});
      },
      function(error){
        res.status(500).json(error);
      }        
    )
  });
}

module.exports.getFile = function(req, res){
  let fileId = req.params.fileId;
  let promise = File.findOne({_id:fileId}).exec();
  promise.then(
    function(file){
      res.setHeader('content-type', file.contentType);
      res.send(file.binaryData)
    }
  )
}