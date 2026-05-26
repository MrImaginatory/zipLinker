import { Router } from "express";
import { signupController, loginController, logoutController } from "../../../controllers/v1/users/user.controller.js";
import validate from "../../../middlewares/v1/validate.middleware.js";
import { validateLoginData, validateUserData } from "../../../validations/users/user.validator.js";
import { getProfileDetails } from "../../../controllers/v1/profile/profile.controller.js";
import { isAuthenticated } from "../../../middlewares/v1/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", validate(validateUserData), signupController);
userRouter.post("/login", validate(validateLoginData), loginController);
userRouter.post("/logout", logoutController);

userRouter.get("/profile", isAuthenticated, getProfileDetails)

export default userRouter;