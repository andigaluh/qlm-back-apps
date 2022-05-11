const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: process.env.APP_CORSURL,
};

app.use(cors(corsOptions));

app.use(express.static("resources/static/assets/"));

global.__basedir = __dirname;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();

/* db.sequelize.sync({ force: true }).then( async () => {
    console.log("Drop and re-sync db.");
    initial();
});  */

const initial = async () => {
  const Role = db.role;
  const Org_class = db.org_class;
  const Org = db.org;
  const Job_class = db.job_class;
  const Job = db.job;

  await Role.create({
    id: 1,
    name: "admin",
  });

  await Role.create({
    id: 2,
    name: "supervisor",
  });

  await Role.create({
    id: 3,
    name: "staff",
  });

  await Role.create({
    id: 4,
    name: "operator",
  });

  await Org_class.create({
    id: 1,
    name: "Company",
    status: 1,
  });

  await Org_class.create({
    id: 2,
    name: "Departement",
    status: 1,
  });

  await Org_class.create({
    id: 3,
    name: "Division",
    status: 1,
  });

  await Org_class.create({
    id: 4,
    name: "Section",
    status: 1,
  });

  await Org_class.create({
    id: 5,
    name: "Unit",
    status: 1,
  });

  await Job_class.create({
    id: 1,
    name: "Direktur",
    status: 1,
  });

  await Job_class.create({
    id: 2,
    name: "Dept. Head",
    status: 1,
    upper_job_class_id: 1,
  });

  await Job_class.create({
    id: 3,
    name: "Div. Head",
    status: 1,
    upper_job_class_id: 2,
  });

  await Job_class.create({
    id: 4,
    name: "Supervisor",
    status: 1,
    upper_job_class_id: 3,
  });

  await Job_class.create({
    id: 5,
    name: "Staff",
    status: 1,
    upper_job_class_id: 4,
  });

  await Job_class.create({
    id: 6,
    name: "Operator",
    status: 1,
    upper_job_class_id: 4,
  });

  await Org.create({
    id: 1,
    name: "Company - PT. Sharp Electronic Indonesia",
    status: 1,
    org_class_id: 1,
  });

  await Org.create({
    id: 2,
    name: "Departement - Washing Machine",
    status: 1,
    org_class_id: 2,
  });

  await Org.create({
    id: 3,
    name: "Division - Production",
    status: 1,
    org_class_id: 3,
  });

  await Org.create({
    id: 4,
    name: "Division - Maintenance",
    status: 1,
    org_class_id: 3,
  });

  await Org.create({
    id: 5,
    name: "Section - Maintenance",
    status: 1,
    org_class_id: 4,
  });

  await Org.create({
    id: 6,
    name: "Section - Quality Insurance",
    status: 1,
    org_class_id: 4,
  });

  await Job.create({
      id: 1,
      name: "Direktur Utama",
      status: 1,
      order_no: 1,
      job_class_id: 1,
      org_id: 1,
    });

await Job.create({
      id: 2,
      name: "Dept. Head WM",
      status: 1,
      order_no: 2,
      job_class_id: 2,
      org_id: 2,
    });

  await Job.create({
      id: 3,
      name: "Div. Head WM",
      status: 1,
      order_no: 3,
      job_class_id: 3,
      org_id: 2,
    });

await Job.create({
      id: 4,
      name: "Supervisor WM Maintenance",
      status: 1,
      order_no: 4,
      job_class_id: 4,
      org_id: 4,
    });

await Job.create({
      id: 5,
      name: "Engineer WM Maintenance",
      status: 1,
      order_no: 5,
      job_class_id: 5,
      org_id: 5,
    });

await Job.create({
      id: 6,
      name: "Operator WM Maintenance",
      status: 1,
      order_no: 6,
      job_class_id: 6,
      org_id: 5,
    });

await Job.create({
      id: 7,
      name: "Supervisor WM QA",
      status: 1,
      order_no: 7,
      job_class_id: 4,
      org_id: 6,
    });

await Job.create({
      id: 8,
      name: "Engineer WM QA",
      status: 1,
      order_no: 8,
      job_class_id: 5,
      org_id: 6,
    });

await Job.create({
      id: 9,
      name: "Operator WM QA",
      status: 1,
      order_no: 8,
      job_class_id: 6,
      org_id: 6,
    }); 
}

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to trace-ability-system backend." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/org.routes')(app);
require("./app/routes/org_class.routes")(app);
require('./app/routes/job.routes')(app);
require('./app/routes/job_class.routes')(app);
require("./app/routes/shift.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/notif.routes")(app);
require("./app/routes/doc_inspection.routes")(app);
require("./app/routes/tools.routes")(app);
require("./app/routes/tools_adjustment_item.routes")(app);
require("./app/routes/tools_excel.routes")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/tools_type.routes")(app);
require("./app/routes/supplier.routes")(app);
require("./app/routes/parts.routes")(app);
require("./app/routes/supplier_excel.routes")(app);
require("./app/routes/parts_excel.routes")(app);
require("./app/routes/iqc.routes")(app);
require("./app/routes/defect.routes")(app);
require("./app/routes/wm_type.routes")(app);
require("./app/routes/wm_model.routes")(app);
require("./app/routes/wm_item_check_category.routes")(app);
require("./app/routes/wm_item_check.routes")(app);
require("./app/routes/wm_check.routes")(app);
require("./app/routes/report_wm_check.routes")(app);
require("./app/routes/schedule_qc.routes")(app);
require("./app/routes/schedule_qc_excel.routes")(app);
require("./app/routes/iqc_history.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});