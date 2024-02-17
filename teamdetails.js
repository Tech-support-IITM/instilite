module.exports = (sequelize, DataTypes) => {
    const TeamsDetails = sequelize.define('TeamsDetails', {
      team_id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      team_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    });
  
    return TeamsDetails;
  };
