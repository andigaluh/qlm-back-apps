const { authJwt } = require("../middleware");
const outgoing = require("../controllers/outgoing.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // read all outgoing
  router.get("/", [authJwt.verifyToken], outgoing.findAll);

  router.get("/download", outgoing.download);

  //router.get("/download_template", outgoing.download_template);

  router.post("/", [authJwt.verifyToken], outgoing.create);

  router.get("/:id", [authJwt.verifyToken], outgoing.findOne);

  router.get("/barcode/:id", [authJwt.verifyToken], outgoing.findByBarcode);

  // delete outgoing by id
  router.delete("/:id", [authJwt.verifyToken], outgoing.deleteById);

  // Update a Job_class with id
  router.put("/:id", [authJwt.verifyToken], outgoing.update);

  app.use("/api/outgoing", router);
};
