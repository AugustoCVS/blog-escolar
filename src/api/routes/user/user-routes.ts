import { Router } from "express";

import { UserController } from "../../controllers/user/user.controller";

const userRoutes = Router();

const userController = new UserController();

userRoutes.post("/register", userController.createUser.bind(userController))
userRoutes.post("/login", userController.loginUser.bind(userController))
userRoutes.get("/:id", userController.getUserById.bind(userController))
userRoutes.put("/:id", userController.updateUser.bind(userController))
userRoutes.delete("/:id", userController.deleteUser.bind(userController))

export { userRoutes };	