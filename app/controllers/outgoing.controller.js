const db = require("../models");
const fs = require("fs");
const Outgoing = db.outgoing;
const User = db.user;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Outgoing.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  }).then(async (data) => {
    let outgoing_data = [];
    let no = 1;
    data.forEach((obj) => {
      outgoing_data.push({
        no: no++,
        id: obj.id,
        model_name: obj.model_name,
        serial_no: obj.serial_no,
        lot_number: obj.lot_number,
        total_qty: obj.total_qty,
        note_remark: obj.note_remark,
        user: obj.user.name,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Outgoing");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Model Name", key: "model_name", width: 10 },
      { header: "Serial Number", key: "serial_no", width: 10 },
      { header: "Lot Number", key: "lot_number", width: 10 },
      { header: "Total Qty", key: "total_qty", width: 10 },
      { header: "Remark", key: "note_remark", width: 10 },
      { header: "User", key: "user", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(outgoing_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_Outgoing.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

/* exports.download_template = (req, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Schedule QC");

  worksheet.columns = [
    { header: "Supplier ID", key: "supplier_name", width: 10 },
    { header: "Parts ID", key: "parts", width: 10 },
    { header: "User ID", key: "user", width: 10 },
    { header: "Objective", key: "objective", width: 10 },
    { header: "Activity", key: "activity", width: 10 },
    { header: "Plan Date (mm/dd/yyyy)", key: "plan_date", width: 10 },
    { header: "Photo Name", key: "photo_name", width: 10 },
    { header: "Photo Date", key: "photo_date", width: 10 },
  ];

  // Add Array Rows
  //worksheet.addRows();

  Supplier.findAll().then(async (data) => {
    let supplier_data = [];
    data.forEach((obj) => {
      supplier_data.push({
        id: obj.id,
        supplier_name: obj.supplier_name,
      });
    });
    let worksheet_supplier = workbook.addWorksheet("Suppliers");

    worksheet_supplier.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Supplier Name", key: "supplier_name", width: 10 },
    ];

    // Add Array Rows
    worksheet_supplier.addRows(supplier_data);

    Parts.findAll().then(async (data) => {
      let parts_data = [];
      data.forEach((obj) => {
        parts_data.push({
          id: obj.id,
          parts_name: obj.parts_name,
          supplier_id: obj.supplier_id,
        });
      });
      let worksheet_parts = workbook.addWorksheet("Parts");

      worksheet_parts.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Parts Name", key: "parts_name", width: 10 },
        { header: "Supplier ID", key: "supplier_id", width: 10 },
      ];

      // Add Array Rows
      worksheet_parts.addRows(parts_data);

      User.findAll().then(async (data) => {
        let user_data = [];
        data.forEach((obj) => {
          user_data.push({
            id: obj.id,
            name: obj.name,
          });
        });
        let worksheet_user = workbook.addWorksheet("User");

        worksheet_user.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "Name", key: "name", width: 10 },
        ];

        // Add Array Rows
        worksheet_user.addRows(user_data);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + Date.now() + "_Outgoing_template.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      });
    });
  });
}; */

exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.createdAt = { [Op.gte]: start_date };
    condition.createdAt = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.createdAt = { [Op.gte]: start_date };
  }

  /* Outgoing.findAll().then((data) => {
    console.log(data);
    res.send(data);
  }) */
  Outgoing.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      let outgoingData = [];

      data.map((obj) => {
        let dataRow = {
          id: obj.id,
          model_name: obj.model_name,
          serial_no: obj.serial_no,
          lot_number: obj.lot_number,
          total_qty: obj.total_qty,
          note_remark: obj.note_remark,
          user: obj.user.name,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };

        outgoingData.push(dataRow);
      });
      //console.log(outgoingData);
      res.send(outgoingData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving schedule qc.",
      });
    }); 
};

exports.create = async (req, res) => {
  try {
    const uploaded = await Outgoing.create({
      model_name: req.body.model_name,
      serial_no: req.body.serial_no,
      lot_number: req.body.lot_number,
      total_qty: req.body.total_qty,
      note_remark: req.body.note_remark,
      user_id: req.body.user_id,
      barcode: req.body.barcode,
      date_check: req.body.date_check,
    });

    return res.send({
      message: "Create outgoing success.",
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error : ${error}` });
  }
};

// Update a Job_class by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let data = {};
  let dateNow = new Date();

    data = {
      model_name: req.body.model_name,
      serial_no: req.body.serial_no,
      lot_number: req.body.lot_number,
      total_qty: req.body.total_qty,
      note_remark: req.body.note_remark,
      user_id: req.body.user_id,
    };
  

  Outgoing.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update outgoing success",
        });
      } else {
        res.send({
          message: `Cannot update outgoing with id=${id}. Maybe outgoing was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating outgoing with id=" + id,
      });
    });
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    
    const delOutgoing = Outgoing.destroy({
      where: { id: id },
    });
    console.log(`proses del Outgoing`);

    return res.status(200).send({
      message: "Delete outgoing success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Outgoing.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Outgoing with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Outgoing with id=" + id,
      });
    });
};

// Find a single Job_class with an id
exports.findByBarcode = (req, res) => {
  const id = req.params.id;

  Outgoing.findAll({
    where: {
      barcode: id,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Outgoing with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Outgoing with id=" + id,
      });
    });
};
