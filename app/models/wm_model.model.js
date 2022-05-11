module.exports = (sequelize, Sequelize) => {
  const Wm_model = sequelize.define(
    "wm_model",
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
      tension_belt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timer_putaran_penuh_wash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timer_putaran_penuh_spin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lid_sw: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Wm_model;
};
