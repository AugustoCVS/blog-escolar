import { Router } from "express";
import { PostsController } from "../../controllers/posts/posts.controller";
import { ensureIsAdmin } from "../../../middlewares/ensure-admin";

const postsRoutes = Router();
const postsController = new PostsController();

postsRoutes.get("/", postsController.getPosts.bind(postsController));
postsRoutes.get("/:id", postsController.getPosts.bind(postsController));
postsRoutes.get("/search", postsController.getPosts.bind(postsController));

postsRoutes.post("/", ensureIsAdmin, postsController.createPost.bind(postsController));
postsRoutes.put("/:id", ensureIsAdmin, postsController.updatePost.bind(postsController));
postsRoutes.delete("/:id", ensureIsAdmin, postsController.deletePost.bind(postsController));

export { postsRoutes };