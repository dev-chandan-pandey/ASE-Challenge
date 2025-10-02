module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Quiz", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
