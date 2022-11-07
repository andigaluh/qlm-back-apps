module.exports = (sequelize, Sequelize) => {
  const Tools = sequelize.define(
    "tools",
    {
      name: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      expired_date: {
        type: Sequelize.DATE,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Tools;
};
