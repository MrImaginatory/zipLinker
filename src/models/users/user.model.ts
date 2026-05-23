import { sequelize } from "../../database/database.js";
import { DataTypes, Model, sql } from "@sequelize/core";

class User extends Model {
    public userId!: string;

    public userName!: string;
    public email!: string;
    public password!: string;
    public isEmailVerified!: boolean;
}

User.init({
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sql.uuidV4
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 128]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [3, 128]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "Users",
})

export default User;