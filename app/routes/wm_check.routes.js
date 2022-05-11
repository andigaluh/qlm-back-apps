const { authJwt } = require("../middleware");
const wm_check = require("../controllers/wm_check.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Machine
  router.post("/", [authJwt.verifyToken], wm_check.create);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken], wm_check.update);

  /* // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.isOperator],
    machine.findAll
  );

  // Retrieve all published Machines
  router.get("/published", machine.findAllPublished);

  // Retrieve a single Machine with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.findOne);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.update);

  // Update a Machine with id
  router.put(
    "/parts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    machine.updateParts
  );

  // Delete a Machine with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.delete);

  // Delete all Machines
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], machine.deleteAll); */

  app.use("/api/wm-check", router);
};
