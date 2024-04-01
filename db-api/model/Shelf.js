const Supermarket = require("./Supermarket");

module.exports = (sequelize, Sequelize) => {
    const Shelf = sequelize.define("shelves", {
        shelf_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        shelf_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        location_x: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        location_y: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        supermarket_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Supermarket,
                key: 'supermarket_id'
            }
        }
    });

    return Shelf;
};