import { sequelize } from "../../database/database.js";
import { DataTypes, Model, sql } from "@sequelize/core";

class ShortLinks extends Model {
    public urlId!: string;
    public userId!: string;
    public shortCode!: string;
    public longUrl!: string;
    public clicks!: number;
    public isActive!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ShortLinks.init({
    urlId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sql.uuidV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    longUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: "short_links",
    timestamps: true
})

export default ShortLinks;