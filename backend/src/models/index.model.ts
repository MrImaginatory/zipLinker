import User from "./users/user.model.js";
import ShortLinks from "./links/link.model.js";
import ClickLog from "./links/clickLog.model.js";

User.hasMany(ShortLinks, {
    foreignKey: "userId",
    as: "shortLinks"
});

ShortLinks.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

ShortLinks.hasMany(ClickLog, {
    foreignKey: "urlId",
    as: "clickLogs"
});

ClickLog.belongsTo(ShortLinks, {
    foreignKey: "urlId",
    as: "shortLink"
});

const model = {
    User,
    ShortLinks,
    ClickLog
}

export default model;