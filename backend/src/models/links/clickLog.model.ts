import { sequelize } from "../../database/database.js";
import { DataTypes, Model, sql } from "@sequelize/core";

class ClickLog extends Model {
    public id!: string;
    public urlId!: string;
    public createdAt!: Date;
}

ClickLog.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sql.uuidV4
    },
    urlId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "click_logs",
    timestamps: true,
    updatedAt: false // Disable updatedAt as click logs are immutable records
});

export default ClickLog;
