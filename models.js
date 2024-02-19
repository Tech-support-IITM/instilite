const { Sequelize } = require('sequelize');
const config = require('./config.json')['development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usercreds = require('./usercreds')(sequelize, Sequelize);
db.teamsdetails = require('./teamsdetails')(sequelize, Sequelize);
db.eventsdetails = require('./eventsdetails')(sequelize, Sequelize);

// Associations
db.teamsdetails.associate = (models) => {
  db.teamsdetails.belongsTo(models.usercreds, { foreignKey: 'team_id' });
};

db.eventsdetails.associate = (models) => {
  db.eventsdetails.belongsTo(models.usercreds, { foreignKey: 'user_id' });
};

db.usercreds.associate = (models) => {
  db.usercreds.hasOne(models.teamsdetails, { foreignKey: 'team_id' });
  db.usercreds.hasOne(models.eventsdetails, { foreignKey: 'user_id' });
};

db.sequelize.sync({ alter: true });

module.exports = db;
