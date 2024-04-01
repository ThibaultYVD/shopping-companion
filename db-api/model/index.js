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
db.supermarket = require("../model/Supermarket.js")(sequelize, Sequelize)
db.shelf = require("../model/Shelf.js")(sequelize, Sequelize)
db.group = require("../model/Group.js")(sequelize, Sequelize)
db.list = require("../model/List.js")(sequelize, Sequelize)
db.product = require("../model/Product.js")(sequelize, Sequelize)

// Tables de jointures

db.user.belongsToMany(db.role, {
    through: "user_role"
});

db.group.belongsToMany(db.user, {
    through: "group_members"
});

db.product.belongsToMany(db.list, {
    through: "products_list"
});


// Clés étrangères

db.shelf.belongsTo(db.supermarket, {
    foreignKey: 'supermarket_id'
});

db.group.belongsTo(db.user, {
    foreignKey: 'user_id'
});

db.list.belongsTo(db.group, {
    foreignKey: 'group_id'
});

db.product.belongsTo(db.shelf, {
    foreignKey: 'shelf_id'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
