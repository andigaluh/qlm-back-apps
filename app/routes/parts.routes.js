const { authJwt } = require("../middleware");
const parts = require("../controllers/parts.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download_template", parts.download_template);

  // Create a new Org_class
  router.post("/", [authJwt.verifyToken], parts.create);

  // Retrieve all Org_classs
  router.get("/", [authJwt.verifyToken], parts.findAll);

  // Retrieve all published Org_classs
  router.get("/published", parts.findAllPublished);

  // Retrieve a single Org_class with id
  router.get("/:id", [authJwt.verifyToken], parts.findOne);

  router.get("/supplier/:id", [authJwt.verifyToken], parts.findBySupplier);;

  // Update a Org_class with id
  router.put("/:id", [authJwt.verifyToken], parts.update);

  // Delete a Org_class with id
  router.delete("/:id", [authJwt.verifyToken], parts.delete);

  // Delete all Org_classs
  router.delete("/", [authJwt.verifyToken], parts.deleteAll);

  app.use("/api/parts", router);
};
