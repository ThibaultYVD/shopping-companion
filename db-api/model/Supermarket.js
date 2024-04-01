module.exports = (sequelize, Sequelize) => {
    const Supermarket = sequelize.define("supermarkets", {
        supermarket_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        supermarket_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address:{
            type: Sequelize.TEXT,
            allowNull: false
        }
    });

    return Supermarket;
};