module.exports = (sequelize, Sequelize) => {
  const Parts = sequelize.define(
    "parts",
    {
      parts_code: {
        type: Sequelize.STRING,
        unique: true,
      },
      parts_name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      standard: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Parts;
};
