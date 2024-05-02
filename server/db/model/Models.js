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
        },
        define: {
            timestamps: false
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User.js")(sequelize, Sequelize);
db.Role = require("./Role.js")(sequelize, Sequelize)
db.Supermarket = require("./Supermarket.js")(sequelize, Sequelize)
db.Shelf = require("./Shelf.js")(sequelize, Sequelize)
db.Group = require("./Group.js")(sequelize, Sequelize)
db.List = require("./List.js")(sequelize, Sequelize)
db.Product = require("./Product.js")(sequelize, Sequelize)

// Tables de jointures

db.User.belongsToMany(db.Role, {
    through: "user_role", foreignKey: 'user_id'
});

db.Role.belongsToMany(db.User, {
    through: "user_role", foreignKey: 'role_id'
});

db.Group.belongsToMany(db.User, {
    through: "group_members", foreignKey: 'group_id'
});
db.User.belongsToMany(db.Group, {
    through: "group_members", foreignKey: 'user_id'
});


db.Product.belongsToMany(db.List, {
    through: "products_list"
});


// Clés étrangères

db.Shelf.belongsTo(db.Supermarket, {
    foreignKey: 'supermarket_id'
});

db.Group.belongsTo(db.User, {
    foreignKey: 'user_id'
});

db.List.belongsTo(db.Group, {
    foreignKey: 'group_id'
});

db.Product.belongsTo(db.Shelf, {
    foreignKey: 'shelf_id'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
