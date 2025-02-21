module.exports = (sequelize, Sequelize) => {
    const GroupMember = sequelize.define("group_members", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "users",
                key: "user_id"
            },
            onDelete: "CASCADE"
        },
        group_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "users_groups",
                key: "group_id"
            },
            onDelete: "CASCADE"
        },
        joined_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false
    });

    return GroupMember;
};