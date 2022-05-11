const { wm_item_check } = require("../models");
const db = require("../models");
const Wm_item_check_category = db.wm_item_check_category;
const Wm_type = db.wm_type;
const Wm_item_check = db.wm_item_check;
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
  const wm_item_check_category = {
    name: req.body.name,
    wm_type_id: req.body.wm_type_id,
  };

  // Save Wm_type in the database
  Wm_item_check_category.create(wm_item_check_category)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create washing machine item check category success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the washing machine item check category.",
      });
    });
};

// Retrieve all Wm_type from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Wm_item_check_category.findAll({
    where: condition,
    include: [
      {
        model: Wm_type,
        as: "wm_type",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine item check category.",
      });
    });
};

exports.findByWmType = (req, res) => {
  const wm_type_id = req.query.wm_type_id;
  var condition = wm_type_id ? { wm_type_id: { [Op.eq]: wm_type_id } } : null;
  let resultCategory = [];
  let resultItem = [];
  let resultItemArray = [];

  /* const category = await Wm_item_check_category.findAll({
    where: condition,
    include: [
      {
        model: Wm_type,
        as: "wm_type",
        attributes: ["id", "name"],
      }
    ],
  }); */

  Wm_item_check_category.findAll({
    where: condition,
  })
    .then((category) => {
      category.map((value) => {

        wm_item_check.findAll({
          where : {
            wm_item_check_category_id: value.id
          }
        }).then((item) => {
          item.map((valueItem) => {
            resultItem.push({
              id: valueItem.id,
              /* name: valueItem.name,
              standard: valueItem.standard */
            })
          })
          //resultItemArray.push(resultItem)
          //console.log(resultItem)
        })


        resultCategory.push({
          id: value.id,
          name: value.name,
          resultItem,
        });
      })
      

      //console.log(resultCategory)
      res.send(resultCategory);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error retrieving washing machine item check category with id=" + id,
      });
    });
};

// Find a single Wm_type with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Wm_item_check_category.findByPk(id, {
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
          message: `Cannot find washing machine item check category with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error retrieving washing machine item check category with id=" + id,
      });
    });
};

// Update a Wm_type by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Wm_item_check_category.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message:
            "washing machine item check category was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update washing machine item check category with id=${id}. Maybe washing machine item check category was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error updating washing machine item check category with id=" + id,
      });
    });
};

// Delete a Wm_type with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Wm_item_check_category.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message:
            "washing machine item check category was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete washing machine item check category with id=${id}. Maybe washing machine item check category was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Could not delete washing machine item check category with id=" + id,
      });
    });
};

// Delete all Wm_type from the database.
exports.deleteAll = (req, res) => {
  Wm_item_check_category.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} washing machine item check category deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all washing machine item check category.",
      });
    });
};

// Find all published Wm_type
exports.findAllPublished = (req, res) => {
  Wm_item_check_category.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine item check category.",
      });
    });
};

exports.findByWmTypeId = (req, res) => {
  const wm_type_id = req.params.wm_type_id;
  var condition = wm_type_id ? { wm_type_id: { [Op.eq]: wm_type_id } } : null;

  Wm_item_check_category.findAll({
    where: condition,
  })
    .then((category) => {
      

      //console.log(resultCategory)
      res.send(category);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error retrieving washing machine item check category with id=" + id,
      });
    });
};
