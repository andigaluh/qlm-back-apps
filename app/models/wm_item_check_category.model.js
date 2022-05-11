module.exports = (sequelize, Sequelize) => {
  const Wm_item_check_category = sequelize.define(
    "wm_item_check_category",
    {
      name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Wm_item_check_category;
};
