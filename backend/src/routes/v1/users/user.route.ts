import { Router } from "express";
import { signupController, loginController, logoutController, refreshController, getSessionsController, revokeSessionController } from "../../../controllers/v1/users/user.controller.js";
import validate from "../../../middlewares/v1/validate.middleware.js";
import { validateLoginData, validateUserData } from "../../../validations/users/user.validator.js";
import { getProfileDetails } from "../../../controllers/v1/profile/profile.controller.js";
import { isAuthenticated } from "../../../middlewares/v1/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", validate(validateUserData), signupController);
userRouter.post("/login", validate(validateLoginData), loginController);
userRouter.post("/logout", logoutController);
userRouter.post("/refresh", refreshController);

userRouter.get("/profile", isAuthenticated, getProfileDetails)

// Session Management
userRouter.get("/sessions", isAuthenticated, getSessionsController);
userRouter.delete("/sessions/:jti", isAuthenticated, revokeSessionController);

export default userRouter;