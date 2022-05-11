module.exports = (sequelize, Sequelize) => {
  const Wm_type = sequelize.define(
    "wm_type",
    {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
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

  return Wm_type;
};
