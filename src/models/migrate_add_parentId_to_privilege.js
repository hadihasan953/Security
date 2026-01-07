// Migration script to add parentId column to Privilege table
import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Privileges", "parentId", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Privileges",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Privileges", "parentId");
}
