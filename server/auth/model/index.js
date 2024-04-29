const config = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../model/User.js")(sequelize, Sequelize);
db.role = require("../model/Role.js")(sequelize, Sequelize)

db.user.belongsToMany(db.role, {
    through: "user_role"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
