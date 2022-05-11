const db = require("../models");
const fs = require("fs");
const Schedule_qc = db.schedule_qc;
const Supplier = db.supplier;
const Parts = db.parts;
const User = db.user;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Schedule_qc.findAll({
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_code","supplier_name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  }).then(async (data) => {
    let schedule_data = [];
    let no = 1;
    data.forEach((obj) => {
      schedule_data.push({
        no: no++,
        id: obj.id,
        supplier_name: obj.supplier.supplier_name,
        parts: obj.parts.parts_name,
        user: obj.user.name,
        objective: obj.objective,
        activity: obj.activity,
        plan_date: obj.plan_date,
        photo_name: obj.photo_name,
        photo_date: obj.photo_date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Schedule QC");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Supplier Name", key: "supplier_name", width: 10 },
      { header: "Spareparts", key: "parts", width: 10 },
      { header: "User", key: "user", width: 10 },
      { header: "Area", key: "objective", width: 10 },
      { header: "Activity", key: "activity", width: 10 },
      { header: "Plan Date", key: "plan_date", width: 10 },
      { header: "Photo Name", key: "photo_name", width: 10 },
      { header: "Photo Date", key: "photo_date", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(schedule_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_schedule_qc.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

exports.download_template = (req, res) => {
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
          "attachment; filename=" + Date.now() + "_schedule_qc_template.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      });
    });
  });
};

exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.plan_date = { [Op.gte]: start_date };
    condition.plan_date = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.plan_date = { [Op.gte]: start_date };
  }

  Schedule_qc.findAll({
    where: condition,
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_code", "supplier_name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      let toolsData = [];

      data.map((row) => {
        //console.log(row.user);
        let dataRow = {
          id: row.id,
          supplier: row.supplier.supplier_name,
          parts: row.parts.parts_name,
          objective: row.objective,
          activity: row.activity,
          plan_date: row.plan_date,
          createdAt: row.createdAt,
          photo_date: row.photo_date,
          photo_name: row.photo_name,
          user: row.user.name,
        };

        toolsData.push(dataRow);
      });

      res.send(toolsData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving schedule qc.",
      });
    });
};

exports.create = async (req, res) => {
  try {
    const splitUrl = req.url.split("/");

    const uploaded = await Schedule_qc.create({
      objective: req.body.objective,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      supplier_id: req.body.supplier_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      //photo_name: req.file.filename,
      //photo_date: req.body.photo_date,
    });

    return res.send({
      message: "Create schedule qc success.",
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload images: ${error}` });
  }
};

// Update a Job_class by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let data = {};
  let dateNow = new Date();
  //console.log(req.file);
  //console.log(req.body.filename);
  if (req.body.photo_name) {
    data = {
      objective: req.body.objective,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      supplier_id: req.body.supplier_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      photo_name: req.body.photo_name,
      photo_date: dateNow,
    };
  } else {
    data = {
      objective: req.body.objective,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      supplier_id: req.body.supplier_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
    };
  }

  Schedule_qc.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update schedule qc success",
        });
      } else {
        res.send({
          message: `Cannot update schedule qc with id=${id}. Maybe schedule qc was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating schedule qc with id=" + id,
      });
    });
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Schedule_qc.findByPk(id, {
      attributes: ["photo_name"],
    });

    //console.log(filename.photo_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir + "/resources/static/assets/uploads/" + filename.photo_name,
        () => {}
      );
      console.log(`proses delExistingFile`);
    }

    const delSchedule_qc = Schedule_qc.destroy({
      where: { id: id },
    });
    console.log(`proses delSchedule_qc`);

    return res.status(200).send({
      message: "Delete schedule qc success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule_qc.findByPk(id, {
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_code", "supplier_name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name"],
      },
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
          message: `Cannot find Schedule_qc with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Schedule_qc with id=" + id,
      });
    });
};
