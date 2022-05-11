const { authJwt } = require("../middleware");
const wm_item_check_category = require("../controllers/wm_item_check_category.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get(
    "/findByWmType/:wm_type_id",
    [authJwt.verifyToken],
    wm_item_check_category.findByWmType
  );

  router.get(
    "/findByWmTypeId/:wm_type_id",
    [authJwt.verifyToken],
    wm_item_check_category.findByWmTypeId
  );

  // Create a new wm_item_check_category
  router.post("/", [authJwt.verifyToken], wm_item_check_category.create);

  // Retrieve all wm_item_check_category
  router.get("/", [authJwt.verifyToken], wm_item_check_category.findAll);

  // Retrieve all wm_item_check_category published
  router.get("/published", wm_item_check_category.findAllPublished);

  // Retrieve  single wm_item_check_category  with id
  router.get("/:id", [authJwt.verifyToken], wm_item_check_category.findOne);

  

  // Update a wm_item_check_category  with id
  router.put("/:id", [authJwt.verifyToken], wm_item_check_category.update);

  // Delete a wm_item_check_category with id
  router.delete("/:id", [authJwt.verifyToken], wm_item_check_category.delete);

  // Delete all wm_item_check_category
  router.delete("/", [authJwt.verifyToken], wm_item_check_category.deleteAll);

  app.use("/api/wm_item_check_category", router);
};
