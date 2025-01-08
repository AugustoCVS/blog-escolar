import { Router } from "express";
import { userRoutes } from "./user/user-routes";
import { postsRoutes } from "./posts/posts-routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/posts", postsRoutes);

export { router };