import { Request, Response } from "express";
import { CreatePostsService } from "../../../services/use-cases/posts/create-posts.service";
import { GetPostsService } from "../../../services/use-cases/posts/get-posts.service";
import { UpdatePostsService } from "../../../services/use-cases/posts/update-posts.service";
import { DeletePostsService } from "../../../services/use-cases/posts/delete-posts.service";
import { GetPostsByIdService } from "../../../services/use-cases/posts/get-posts-by-id.service";

class PostsController {
  async createPost(request: Request, response: Response) {
    const { title, content, authorId } = request.body;

    const createPostUseCase = new CreatePostsService();

    await createPostUseCase.execute({
      title,
      content,
      authorId,
    });

    return response.status(201).send();
  }

  async getPosts(request: Request, response: Response) {
    const { page, limit } = request.query;

    const getPostsUseCase = new GetPostsService();

    const posts = await getPostsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
    });

    return response.json(posts);
  }

  async getPostById(request: Request, response: Response) {
    const { id } = request.params;

    const getPostsByIdUseCase = new GetPostsByIdService();

    const post = await getPostsByIdUseCase.execute({
      postsId: id,
    });

    return response.json(post);
  }

  async getPostsByAuthor(request: Request, response: Response) {
    const { authorId } = request.params;
    const { page, limit } = request.query;

    const getPostsUseCase = new GetPostsService();

    const posts = await getPostsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      authorId,
    });

    return response.json(posts);
  }

  async getPostsBySearch(request: Request, response: Response) {
    const { title, content } = request.query;
    const { page, limit } = request.query;

    const getPostsUseCase = new GetPostsService();

    const posts = await getPostsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      title: String(title),
      content: String(content),
    });

    return response.json(posts);
  }

  async updatePost(request: Request, response: Response) {
    const { id } = request.params;
    const { title, content, authorId } = request.body;

    const updatePostUseCase = new UpdatePostsService();

    await updatePostUseCase.execute({
      id,
      postData: {
        title,
        content,
        authorId,
      },
    });

    return response.status(204).send();
  }

  async deletePost(request: Request, response: Response) {
    const { id } = request.params;

    const deletePostUseCase = new DeletePostsService();

    await deletePostUseCase.execute({
      postId: id,
    });

    return response.status(204).send();
  }
}

export { PostsController };