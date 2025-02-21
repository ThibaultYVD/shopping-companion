module.exports = (sequelize, Sequelize) => {
    const ProductsLists = sequelize.define("products_lists", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "products",
                key: "product_id"
            },
            onDelete: "CASCADE"
        },
        list_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "lists",
                key: "list_id"
            },
            onDelete: "CASCADE"
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        user_id:{
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "user_id"
            },
        },
        added_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false
    });

    return ProductsLists;
};