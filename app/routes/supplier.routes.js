const { authJwt } = require("../middleware");
const supplier = require("../controllers/supplier.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Job_class
  router.post("/", [authJwt.verifyToken], supplier.create);

  // Retrieve all Job_class
  router.get("/", [authJwt.verifyToken], supplier.findAll);

  // Retrieve all published Job_class
  router.get("/published", supplier.findAllPublished);

  // Retrieve a single Job_class with id
  router.get("/:id", [authJwt.verifyToken], supplier.findOne);

  // Update a Job_class with id
  router.put("/:id", [authJwt.verifyToken], supplier.update);

  // Delete a Job_class with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    supplier.delete
  );

  // Delete all Job_class
  router.delete(
    "/",
    [authJwt.verifyToken],
    supplier.deleteAll
  );

  app.use("/api/supplier", router);
};
