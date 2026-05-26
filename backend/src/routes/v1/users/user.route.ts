import { Router } from "express";
import { signupController, loginController, logoutController } from "../../../controllers/v1/users/user.controller.js";
import validate from "../../../middlewares/v1/validate.middleware.js";
import { validateLoginData, validateUserData } from "../../../validations/users/user.validator.js";

const userRouter = Router();

userRouter.post("/register", validate(validateUserData), signupController);
userRouter.post("/login", validate(validateLoginData), loginController);
userRouter.post("/logout", logoutController);

export default userRouter;