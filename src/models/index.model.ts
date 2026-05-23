import User from "./users/user.model.js";
import ShortLinks from "./links/link.model.js";

User.hasMany(ShortLinks, {
    foreignKey: "userId",
    as: "shortLinks"
});

ShortLinks.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

const model = {
    User,
    ShortLinks
}

export default model;