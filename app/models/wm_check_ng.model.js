module.exports = (sequelize, Sequelize) => {
  const Wm_check_ng = sequelize.define("wm_check_ng", {
    sn: {
      type: Sequelize.STRING,
    },
    masalah: {
      type: Sequelize.TEXT,
    },
    tindakan: {
      type: Sequelize.TEXT,
    },
  });

  return Wm_check_ng;
};
