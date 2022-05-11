const db = require("../models");
const Wm_item_check = db.wm_item_check;
const Wm_item_check_category = db.wm_item_check_category;
const Wm_type = db.wm_type;
const Op = db.Sequelize.Op;

// Create and Save a new Wm_item_check
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Wm_item_check
  const wm_model = {
    name: req.body.name,
    standard: req.body.standard,
    is_boolean: req.body.is_boolean ? req.body.is_boolean : false,
    wm_item_check_category_id: req.body.wm_item_check_category_id,
  };

  // Save Wm_item_check in the database
  Wm_item_check.create(wm_model)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create washing machine item check success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the washing machine item check.",
      });
    });
};

// Retrieve all Wm_item_check from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Wm_item_check.findAll({
    where: condition,
    include: [
      {
        model: Wm_item_check_category,
        as: "wm_item_check_category",
        attributes: ["id", "name"],
        include: [
          {
            model: Wm_type,
            as: "wm_type",
            attributes: ["id", "name"]
          },
        ],
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
          "Some error occurred while retrieving washing machine item check.",
      });
    });
};

exports.findByCategory = (req, res) => {
  const wm_type_id = req.params.id;
  var condition = wm_type_id
    ? { wm_type_id: { [Op.eq]: wm_type_id } }
    : null;

  Wm_item_check.findAll({
    //where: condition,
    include: [
      {
        model: Wm_item_check_category,
        as: "wm_item_check_category",
        attributes: ["id", "name"],
        where : condition
      },
    ],
  })
    .then((data) => {
      //console.log(wm_type_id);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine item check.",
      });
    });
};

// Find a single Wm_item_check with an id
exports.findOne = (req, res) => {
  let result = [];
  const id = req.params.id;

  Wm_item_check.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Wm_item_check_category,
        as: "wm_item_check_category",
        attributes: ["id", "name"],
        include: [
          {
            model: Wm_type,
            as: "wm_type",
            attributes: ["id", "name"]
          }
        ]
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find washing machine item check with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving washing machine item check with id=" + id,
      });
    });
};

// Update a Wm_item_check by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Wm_item_check.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update washing machine item check success",
        });
      } else {
        res.send({
          message: `Cannot update washing machine item check with id=${id}. Maybe washing machine item check was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating washing machine item check with id=" + id,
      });
    });
};

// Delete a Wm_item_check with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Wm_item_check.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete washing machine item check success",
        });
      } else {
        res.send({
          message: `Cannot delete washing machine item check with id=${id}. Maybe washing machine item check was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete washing machine item check with id=" + id,
      });
    });
};

// Delete all Wm_item_check from the database.
exports.deleteAll = (req, res) => {
  Wm_item_check.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} washing machine item check were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all washing machine item check.",
      });
    });
};

// Find all published Wm_item_check
exports.findAllPublished = (req, res) => {
  Wm_item_check.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine item check.",
      });
    });
};
