module.exports = (sequelize, Sequelize) => {
  const Wm_item_check = sequelize.define(
    "wm_item_check",
    {
      name: {
        type: Sequelize.STRING,
      },
      standard: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_boolean: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Wm_item_check;
};
