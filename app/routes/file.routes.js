let authController = require("../controllers/auth.controller.js");
let fileController = require("../controllers/file.controller.js");

module.exports = function(app){
  app.use("/api/:userId", authController.check);
  app.post("/api/:userId/upload", fileController.uploadFile);
  app.get("/api/:userId/files/:fileId", fileController.getFile);
}