const db = require("../models");
const fs = require("fs");
const Schedule_qc_excel = db.schedule_qc_excel;
const User = db.user;
const Op = db.Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");
const Schedule_qc = db.schedule_qc;

exports.findAll = (req, res) => {
  const file_name = req.query.file_name;

  Schedule_qc_excel.findAll({
    include: [
      {
        model: User,
        as: "user",
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
          err.message || "Some error occurred while retrieving schedule_qc_excel.",
      });
    });
};

exports.uploadFiles = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    const uploaded = await Schedule_qc_excel.create({
      user_id: req.body.user_id,
      file_name: req.file.filename,
    });

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let ScheduleQcData = [];

      rows.forEach((row) => {
        let scheduleQc_data = {
          supplier_id: row[0],
          parts_id: row[1],
          user_id: row[2],
          objective: row[3],
          activity: row[4],
          plan_date: row[5],
          photo_name: row[6],
          photo_date: row[7],
        };

        ScheduleQcData.push(scheduleQc_data);
      });

      Schedule_qc.bulkCreate(ScheduleQcData)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });

    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload file: ${error}` });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Schedule_qc_excel.findByPk(id, {
      attributes: ["file_name"],
    });

    console.log(filename.file_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir + "/resources/static/assets/uploads/" + filename.file_name,
        () => {}
      );
      console.log(`proses delExistingFile`);
    }

    const delSchedule_qc_excel = Schedule_qc_excel.destroy({
      where: { id: id },
    });
    console.log(`proses delSchedule_qc_excel`);

    return res.status(200).send({
      message: "Delete schedule qc excel success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule_qc_excel.findByPk(id, {
    includes: [
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
          message: `Cannot find Schedule_qc_excel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Schedule_qc_excel with id=" + id,
      });
    });
};
