const { authJwt } = require("../middleware");
const wm_item_check = require("../controllers/wm_item_checks.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get(
    "/findByCategory/:id",
    [authJwt.verifyToken],
    wm_item_check.findByCategory
  );

  // Create a new wm_item_check
  router.post("/", [authJwt.verifyToken], wm_item_check.create);

  // Retrieve all wm_item_check
  router.get("/", [authJwt.verifyToken], wm_item_check.findAll);

  // Retrieve all wm_item_check published
  router.get("/published", wm_item_check.findAllPublished);

  // Retrieve  single wm_item_check  with id
  router.get("/:id", [authJwt.verifyToken], wm_item_check.findOne);

  // Update a wm_item_check  with id
  router.put("/:id", [authJwt.verifyToken], wm_item_check.update);

  // Delete a wm_item_check with id
  router.delete("/:id", [authJwt.verifyToken], wm_item_check.delete);

  // Delete all wm_item_check
  router.delete("/", [authJwt.verifyToken], wm_item_check.deleteAll);

  app.use("/api/wm_item_check", router);
};
