const db = require("../models");
const Defect = db.defect;
const Op = db.Sequelize.Op;

// Create and Save a new Defect
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Defect
  const defect = {
    name: req.body.name
  };

  // Save Defect in the database
  Defect.create(defect)
    .then((data) => {
      res.send({
        message: "Create defect success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Defect.",
      });
    });
};

// Retrieve all Defect from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Defect.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving defect.",
      });
    });
};

// Find a single Defect with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Defect.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Defect with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Defect with id=" + id,
      });
    });
};

// Update a Defect by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Defect.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update defect success.",
        });
      } else {
        res.send({
          message: `Cannot update Defect with id=${id}. Maybe Defect was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Defect with id=" + id,
      });
    });
};

// Delete a Defect with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Defect.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete defect success",
        });
      } else {
        res.send({
          message: `Cannot delete Defect with id=${id}. Maybe Defect was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Defect with id=" + id,
      });
    });
};

// Delete all Defect from the database.
exports.deleteAll = (req, res) => {
  Defect.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Defect success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all defectes.",
      });
    });
};

// Find all published Shift
exports.findAllPublished = (req, res) => {
  Shift.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving defectes.",
      });
    });
};
