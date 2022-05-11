const { authJwt } = require("../middleware");
const wm_type = require("../controllers/wm_type.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new wm_type
  router.post("/", [authJwt.verifyToken], wm_type.create);

  // Retrieve all wm_type
  router.get("/", [authJwt.verifyToken], wm_type.findAll);

  // Retrieve all wm_type published
  router.get("/published", wm_type.findAllPublished);

  // Retrieve  single wm_type  with id
  router.get("/:id", [authJwt.verifyToken], wm_type.findOne);

  // Update a wm_type  with id
  router.put("/:id", [authJwt.verifyToken], wm_type.update);

  // Delete a wm_type with id
  router.delete("/:id", [authJwt.verifyToken], wm_type.delete);

  // Delete all wm_type
  router.delete("/", [authJwt.verifyToken], wm_type.deleteAll);

  app.use("/api/wm_type", router);
};
