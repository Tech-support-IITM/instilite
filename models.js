const { Sequelize } = require('sequelize');
const config = require('../config/config.json')['development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usercred = require('../models/usercred')(sequelize, Sequelize);
db.teamsdetails = require('../models/teamsdetails')(sequelize, Sequelize);
db.eventsdetails = require('../models/eventsdetails')(sequelize, Sequelize);

// Move the association to the end of the file
db.usercred.associate = (models) => {
  db.usercred.hasOne(models.TeamsDetails, { foreignKey: 'team_id' });
};

db.sequelize.sync({ alter: true });

module.exports = db;