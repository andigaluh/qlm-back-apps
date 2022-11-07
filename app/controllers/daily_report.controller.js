const db = require("../models");
const fs = require("fs");
const Daily_report = db.daily_report;
const Org_class = db.org_class;
const Op = db.Sequelize.Op;

/* exports.findAll = async (req, res) => {
  try {
    const findAll = await Daily_report.findAndCountAll({
      attributes: ["id", "title", "description", "file_name", "status", "createdAt"],
      order: [["id", "DESC"]],
    });
    
    return res.send(findAll);
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
}; */

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Daily_report.findAll({
    where: condition,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving org_class.",
      });
    });
};

exports.create = async (req, res) => {
  try {
    
    const uploaded = await Daily_report.create({
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
    });

    return res.send({
      message: "Create daily report success.",
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload images: ${error}` });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const splitUrl = req.url.split("/");

    const uploaded = await Daily_report.create({
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
      draft_file_name: req.file.filename,
    });

    return res.send({
      message: "Create daily report success.",
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload images: ${error}` });
  }
};

// Update a Job_class by the id in the request
exports.updateDraft = (req, res) => {
  const id = req.params.id;
  let data = {};

  if (req.file) {
    data = {
      draft_file_name: req.file.filename,
    };

    Daily_report.findByPk(id, {
      attributes: ["draft_file_name"],
    })
      .then((responseFile) => {
        if (responseFile) {
          fs.unlink(
            __basedir +
              "/resources/static/assets/uploads/" +
              responseFile.draft_file_name,
            () => {}
          );
          console.log(
            `proses delExistingFile dari update ${responseFile.draft_file_name}`
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "Error deleting document inspection with id=" +
            id +
            "with error : " +
            err,
        });
      });
  } 

  Daily_report.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update daily report draft success",
        });
      } else {
        res.send({
          message: `Cannot update daily report draft with id=${id}. Maybe daily report draft was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating daily report draft with id=" + id,
      });
    });
};

exports.updateRelease = (req, res) => {
  const id = req.params.id;
  let data = {};

  if (req.file) {
    data = {
      release_file_name: req.file.filename,
    };

    Daily_report.findByPk(id, {
      attributes: ["release_file_name"],
    })
      .then((responseFile) => {
        if (responseFile) {
          fs.unlink(
            __basedir +
              "/resources/static/assets/uploads/" +
              responseFile.release_file_name,
            () => {}
          );
          console.log(
            `proses delExistingFile dari update ${responseFile.release_file_name}`
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "Error deleting release daily report with id=" +
            id +
            "with error : " +
            err,
        });
      });
  }

  Daily_report.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update daily report release success",
        });
      } else {
        res.send({
          message: `Cannot update daily report release with id=${id}. Maybe daily report release was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating daily report release with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  let data = {};

  data = {
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
    };

  Daily_report.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update daily report success",
        });
      } else {
        res.send({
          message: `Cannot update daily report with id=${id}. Maybe daily report was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating daily report with id=" + id,
      });
    });
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Daily_report.findByPk(id, {
      attributes: ["draft_file_name"],
    });

    console.log(filename.draft_file_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir + "/resources/static/assets/uploads/" + filename.draft_file_name,
        () => {}
      );
      console.log(`proses delExistingFile draft ${filename.draft_file_name}`);
    }

    const filenameRelease = await Daily_report.findByPk(id, {
      attributes: ["release_file_name"],
    });

    console.log(filenameRelease.release_file_name);

    if (filenameRelease) {
      const delExistingFile = fs.unlink(
        __basedir +
          "/resources/static/assets/uploads/" +
          filenameRelease.release_file_name,
        () => {}
      );
      console.log(
        `proses delExistingFile release ${filenameRelease.release_file_name}`
      );
    }

    const delDaily_report = await Daily_report.destroy({
      where: { id: id },
    });
    console.log(`proses delDaily_report`);

    return res.status(200).send({
      message: "Delete daily report success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Daily_report.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Daily_report with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Daily_report with id=" + id,
      });
    });
};
