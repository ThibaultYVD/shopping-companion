const Supermarket = require("./Supermarket");

module.exports = (sequelize, Sequelize) => {
    const Shelf = sequelize.define("shelves", {
        shelf_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
                model: "supermarkets",
                key: 'supermarket_id'
            }
        }
    },{
        timestamps:false
    });

    return Shelf;
};