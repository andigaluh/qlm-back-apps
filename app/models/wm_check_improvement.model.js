module.exports = (sequelize, Sequelize) => {
  const Wm_check_improvement = sequelize.define(
    "wm_check_improvement",
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
      result: {
        type: Sequelize.STRING,
        allowNull: true
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Wm_check_improvement;
};
