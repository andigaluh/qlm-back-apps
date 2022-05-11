module.exports = (sequelize, Sequelize) => {
  const Wm_check_item = sequelize.define("wm_check_item", {
    status: {
      type: Sequelize.STRING,
    },
    check_value: {
      type: Sequelize.STRING,
    },
  });

  return Wm_check_item;
};
