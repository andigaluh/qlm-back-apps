const db = require("../models");
const Wm_model = db.wm_model;
const Wm_type = db.wm_type;
const Op = db.Sequelize.Op;

// Create and Save a new Wm_model
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Wm_model
  const wm_model = {
    name: req.body.name,
    description: req.body.description,
    wm_type_id: req.body.wm_type_id,
    tension_belt: req.body.tension_belt,
    timer_putaran_penuh_wash: req.body.timer_putaran_penuh_wash,
    timer_putaran_penuh_spin: req.body.timer_putaran_penuh_spin,
    lid_sw: req.body.lid_sw,
  };

  // Save Wm_model in the database
  Wm_model.create(wm_model)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create washing machine model success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Wm_model.",
      });
    });
};

// Retrieve all Wm_model from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Wm_model.findAll({
    where: condition,
    include: [
      {
        model: Wm_type,
        as: "wm_type",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving washing machine model.",
      });
    });
};

exports.findByWmType = (req, res) => {
  const wm_type_id = req.params.wm_type_id;
  var condition = wm_type_id ? { wm_type_id: { [Op.eq]: wm_type_id } } : null;

  Wm_model.findAll({
    where: condition,
    include: [
      {
        model: Wm_type,
        as: "wm_type",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine model.",
      });
    });
};


// Find a single Wm_model with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Wm_model.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Wm_type,
        as: "wm_type",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find washing machine model with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving washing machine model with id=" + id,
      });
    });
};

// Update a Wm_model by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Wm_model.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update washing machine model success",
        });
      } else {
        res.send({
          message: `Cannot update washing machine model with id=${id}. Maybe washing machine model was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating washing machine model with id=" + id,
      });
    });
};

// Delete a Wm_model with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Wm_model.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete washing machine model success",
        });
      } else {
        res.send({
          message: `Cannot delete washing machine model with id=${id}. Maybe washing machine model was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete washing machine model with id=" + id,
      });
    });
};

// Delete all Wm_model from the database.
exports.deleteAll = (req, res) => {
  Wm_model.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} washing machine model were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all washing machine model.",
      });
    });
};

// Find all published Wm_model
exports.findAllPublished = (req, res) => {
  Wm_model.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine model.",
      });
    });
};
