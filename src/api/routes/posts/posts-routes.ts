import { Router } from "express";
import { PostsController } from "../../controllers/posts/posts.controller";
import { ensureIsAdmin } from "../../../middlewares/ensure-admin";

const postsRoutes = Router();
const postsController = new PostsController();

postsRoutes.get("/list", postsController.getPosts.bind(postsController));
postsRoutes.get("/list/:id", postsController.getPostById.bind(postsController));
postsRoutes.get("/search", postsController.getPostsBySearch.bind(postsController));

postsRoutes.get("/author", ensureIsAdmin, postsController.getPostsByAuthor.bind(postsController));
postsRoutes.post("/", ensureIsAdmin, postsController.createPost.bind(postsController));
postsRoutes.put("/update/:postId", ensureIsAdmin, postsController.updatePost.bind(postsController));
postsRoutes.delete("/:postId", ensureIsAdmin, postsController.deletePost.bind(postsController));

export { postsRoutes };