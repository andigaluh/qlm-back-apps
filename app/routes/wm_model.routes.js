const { authJwt } = require("../middleware");
const wm_model = require("../controllers/wm_model.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get(
    "/findByWmType/:wm_type_id",
    [authJwt.verifyToken],
    wm_model.findByWmType
  );

  // Create a new wm_model
  router.post("/", [authJwt.verifyToken], wm_model.create);

  // Retrieve all wm_model
  router.get("/", [authJwt.verifyToken], wm_model.findAll);

  // Retrieve all wm_model published
  router.get("/published", wm_model.findAllPublished);

  // Retrieve  single wm_model  with id
  router.get("/:id", [authJwt.verifyToken], wm_model.findOne);

  // Update a wm_model  with id
  router.put("/:id", [authJwt.verifyToken], wm_model.update);

  // Delete a wm_model with id
  router.delete("/:id", [authJwt.verifyToken], wm_model.delete);

  // Delete all wm_model
  router.delete("/", [authJwt.verifyToken], wm_model.deleteAll);

  app.use("/api/wm_model", router);
};
