module.exports = (sequelize, DataTypes) => {
    const UserCred = sequelize.define('UserCred', {
      user_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      user_phone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      user_password: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      user_role: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      user_access_token: {
        type: DataTypes.STRING(30),
      },
      team_id: {
        type: DataTypes.STRING(20),
      },
    }, {});
  
    UserCred.associate = (models) => {
      UserCred.hasOne(models.TeamsDetails, { foreignKey: 'team_id' });
    };
  
    return UserCred;
  };