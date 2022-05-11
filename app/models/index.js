const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,
        operatorsAliases: false,
        timezone:'+07:00',
        logging: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model.js")(
  sequelize,
  Sequelize
);
db.doc_inspection = require("./doc_inspection.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.job = require("./job.model.js")(sequelize, Sequelize);
db.job_class = require("./job_class.model.js")(sequelize, Sequelize);
db.org = require("./org.model.js")(sequelize, Sequelize);
db.org_class = require("./org_class.model.js")(sequelize, Sequelize);
db.shift = require("./shift.model.js")(sequelize, Sequelize);
db.tools_type = require("./tools_type.model.js")(sequelize, Sequelize);
db.tools = require("./tools.model.js")(sequelize, Sequelize);
db.tools_adjustment = require("./tools_adjustment.model.js")(sequelize, Sequelize);
db.tools_adjustment_item = require("./tools_adjustment_item.model.js")(sequelize, Sequelize);
db.tools_excel = require("./tools_excel.model.js")(sequelize, Sequelize);
db.supplier = require("./supplier.model.js")(sequelize, Sequelize);
db.supplier_excel = require("./supplier_excel.model.js")(sequelize, Sequelize);
db.parts = require("./parts.model.js")(sequelize, Sequelize);
db.parts_excel = require("./parts_excel.model.js")(sequelize, Sequelize);
db.defect = require("./defect.model.js")(sequelize, Sequelize);
db.iqc = require("./iqc.model.js")(sequelize, Sequelize);
db.menu = require("./menu.model.js")(sequelize, Sequelize);
db.notif = require("./notif.model.js")(sequelize, Sequelize);
db.wm_type = require("./wm_type.model.js")(sequelize, Sequelize);
db.wm_model = require("./wm_model.model.js")(sequelize, Sequelize);
db.wm_item_check_category = require("./wm_item_check_category.model.js")(sequelize, Sequelize);
db.wm_item_check = require("./wm_item_check.model.js")(sequelize, Sequelize);
db.wm_check = require("./wm_check.model.js")(sequelize, Sequelize);
db.wm_check_item = require("./wm_check_item.model.js")(sequelize, Sequelize);
db.wm_check_improvement = require("./wm_check_improvement.model.js")(sequelize, Sequelize);
db.wm_check_ng = require("./wm_check_ng.model.js")(sequelize, Sequelize);
db.report_wm_check = require("./report_wm_check.model.js")(
  sequelize,
  Sequelize
);
db.schedule_qc = require("./schedule_qc.model.js")(sequelize, Sequelize);
db.schedule_qc_excel = require("./schedule_qc_excel.model.js")(
  sequelize,
  Sequelize
);
db.iqc_history = require("./iqc_history.model.js")(sequelize, Sequelize);




db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});





db.wm_check_improvement.belongsTo(db.wm_check, {
  foreignKey: "wm_check_id",
});
db.wm_check_ng.belongsTo(db.wm_check, {
  foreignKey: "wm_check_id",
});

db.wm_check.belongsTo(db.wm_type, { foreignKey: "wm_type_id" });

db.wm_check.belongsTo(db.wm_model, { foreignKey: "wm_model_id" });
db.wm_check.belongsTo(db.user, { foreignKey: "inspection_id" });
db.wm_check.belongsTo(db.user, { foreignKey: "supervisor_id" });
db.wm_item_check.belongsTo(db.wm_item_check_category, {
  foreignKey: "wm_item_check_category_id",
  as: "wm_item_check_category",
});
db.wm_item_check_category.belongsTo(db.wm_type, { foreignKey: "wm_type_id", as: "wm_type" });
db.wm_model.belongsTo(db.wm_type, { foreignKey: "wm_type_id", as: "wm_type" });
db.iqc.belongsTo(db.parts, { foreignKey: "parts_id", as: "parts" });
db.iqc.belongsTo(db.defect, { foreignKey: "defect_id", as: "defect" });
db.iqc.belongsTo(db.user, { foreignKey: "user_id", as: "user" });
db.iqc.belongsTo(db.user, { foreignKey: "supervisor_id", as: "supervisor" });
db.parts.belongsTo(db.supplier, { foreignKey: "supplier_id", as: "supplier" });
db.job.belongsTo(db.job_class, { foreignKey: "job_class_id", as: "job_class" });
db.job.belongsTo(db.org, { foreignKey: "org_id", as: "org" });
db.job_class.belongsTo(db.job_class, {
  foreignKey: "upper_job_class_id",
  as: "upper_job_class",
});
db.org.belongsTo(db.org_class, { foreignKey: "org_class_id", as : "org_class" });
db.tools.belongsTo(db.tools_type, { foreignKey: "tools_type_id" });

db.user.belongsTo(db.job, { foreignKey: "job_id" });
db.notif.belongsTo(db.user, { foreignKey: "user_id" });

db.tools_adjustment_item.belongsTo(db.tools, { foreignKey: "tools_id", as: "tools"});
db.tools_adjustment_item.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.tools_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.supplier_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.parts_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.wm_check_item.belongsTo(db.wm_item_check, {
  foreignKey: "wm_item_check_id",
  as: "wm_item_check",
});

db.schedule_qc.belongsTo(db.supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
});
db.schedule_qc.belongsTo(db.parts, {
  foreignKey: "parts_id",
  as: "parts",
});
db.schedule_qc.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.schedule_qc_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.wm_check_ng.belongsTo(db.wm_item_check, { foreignKey: "wm_item_check_id" });

db.wm_check.belongsToMany(db.wm_item_check, {
  through: "wm_check_item",
  foreignKey: "wm_check_id",
});

db.wm_item_check.belongsToMany(db.wm_check, {
  through: "wm_check_item",
  foreignKey: "wm_item_check_id",
});

db.menu.belongsToMany(db.user, {
    through: "user_menus",
    foreignKey: "menu_id",
    otherKey: "user_id",
});
db.user.belongsToMany(db.menu, {
    through: "user_menus",
    foreignKey: "user_id",
    otherKey: "menu_id",
});


db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

db.iqc_history.belongsTo(db.iqc, {
  foreignKey: "iqc_id",
});

db.ROLES = ["admin", "supervisor", "staff", "operator","manager"];

module.exports = db;