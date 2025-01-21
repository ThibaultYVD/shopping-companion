const Shelf = require("./Shelf");

module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        shelf_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "shelves",
                key: 'shelf_id'
            }
        }

    },{
        timestamps:false
    });

    return Product;
};