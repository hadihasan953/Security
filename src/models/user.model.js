import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: DataTypes.STRING,
    });
    return User;
};

export default UserModel;