import { Request, Response } from "express";
import { CreatePostsService } from "../../../services/use-cases/posts/create-posts.service";
import { GetPostsService } from "../../../services/use-cases/posts/get-posts.service";
import { UpdatePostsService } from "../../../services/use-cases/posts/update-posts.service";
import { DeletePostsService } from "../../../services/use-cases/posts/delete-posts.service";

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
    const { id } = request.params;
    const { page, limit, title, content } = request.query;

    const getPostsUseCase = new GetPostsService();

    const posts = await getPostsUseCase.execute({
      postsId: id,
      page: Number(page),
      limit: Number(limit),
      title: title as string,
      content: content as string,
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