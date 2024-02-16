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
      team_created_date: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    });
  
    return TeamsDetails;
  };