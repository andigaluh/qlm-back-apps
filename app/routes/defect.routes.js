const { authJwt } = require("../middleware");
const defect = require("../controllers/defect.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Org_class
  router.post("/", [authJwt.verifyToken], defect.create);

  // Retrieve all Org_classs
  router.get("/", [authJwt.verifyToken], defect.findAll);

  // Retrieve all published Org_classs
  router.get("/published", defect.findAllPublished);

  // Retrieve a single Org_class with id
  router.get("/:id", [authJwt.verifyToken], defect.findOne);

  // Update a Org_class with id
  router.put("/:id", [authJwt.verifyToken], defect.update);

  // Delete a Org_class with id
  router.delete("/:id", [authJwt.verifyToken], defect.delete);

  // Delete all Org_classs
  router.delete("/", [authJwt.verifyToken], defect.deleteAll);

  app.use("/api/defect", router);
};
