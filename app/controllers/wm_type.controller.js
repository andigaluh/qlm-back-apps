const db = require("../models");
const Wm_type = db.wm_type;
const Op = db.Sequelize.Op;

// Create and Save a new Wm_type
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Wm_type
  const wm_type = {
    name: req.body.name,
    description: req.body.description,
  };

  // Save Wm_type in the database
  Wm_type.create(wm_type)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create washing machine type success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Wm_type.",
      });
    });
};

// Retrieve all Wm_type from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Wm_type.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wm_type.",
      });
    });
};

// Find a single Wm_type with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Wm_type.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Wm_type with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Wm_type with id=" + id,
      });
    });
};

// Update a Wm_type by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Wm_type.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Washing machine type was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Wm_type with id=${id}. Maybe Wm_type was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Wm_type with id=" + id,
      });
    });
};

// Delete a Wm_type with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Wm_type.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Washing machine type was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Wm_type with id=${id}. Maybe Wm_type was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Wm_type with id=" + id,
      });
    });
};

// Delete all Wm_type from the database.
exports.deleteAll = (req, res) => {
  Wm_type.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Washing machine type deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tools_typees.",
      });
    });
};

// Find all published Wm_type
exports.findAllPublished = (req, res) => {
  Wm_type.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wm_type.",
      });
    });
};
