module.exports = (sequelize, Sequelize) => {
    const Supermarket = sequelize.define("supermarkets", {
        supermarket_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        supermarket_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address:{
            type: Sequelize.TEXT,
            allowNull: false
        }
    },{
        timestamps:false
    });

    return Supermarket;
};