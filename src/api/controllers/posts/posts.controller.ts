import { Request, Response } from "express";
import { CreatePostsService } from "../../../services/use-cases/posts/create-posts.service";
import { GetPostsService } from "../../../services/use-cases/posts/get-posts.service";
import { UpdatePostsService } from "../../../services/use-cases/posts/update-posts.service";
import { DeletePostsService } from "../../../services/use-cases/posts/delete-posts.service";
import { GetPostsByIdService } from "../../../services/use-cases/posts/get-posts-by-id.service";
import { GetPostsBySearchService } from "../../../services/use-cases/posts/get-posts-by-search.service";
import { GetPostsByAuthorIdService } from "../../../services/use-cases/posts/get-posts-by-author.service";

class PostsController {
  async createPost(request: Request, response: Response) {
    const { userId } = request.query;
    const { title, content } = request.body;

    const authorIdString = String(userId);

    const createPostUseCase = new CreatePostsService();

    await createPostUseCase.execute({
      title,
      content,
      authorId: authorIdString,
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
    const { page, limit, userId } = request.query;

    const getPostsByAuthorUseCase = new GetPostsByAuthorIdService();

    const authorIdString = String(userId);

    const posts = await getPostsByAuthorUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      authorId: authorIdString,
    });

    return response.json(posts);
  }

  async getPostsBySearch(request: Request, response: Response) {
    const { searchQuery } = request.query;
    const { page, limit } = request.query;

    const getPostsBySearchUseCase = new GetPostsBySearchService();

    const posts = await getPostsBySearchUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      searchQuery: String(searchQuery),
    });

    return response.json(posts);
  }

  async updatePost(request: Request, response: Response) {
    const { postId } = request.params;
    const { title, content } = request.body;

    const updatePostUseCase = new UpdatePostsService();

    await updatePostUseCase.execute({
      id: postId,
      postData: {
        title,
        content,
      },
    });

    return response.status(204).send();
  }

  async deletePost(request: Request, response: Response) {
    const { postId } = request.params;

    const deletePostUseCase = new DeletePostsService();

    await deletePostUseCase.execute({
      postId,
    });

    return response.status(204).send();
  }
}

export { PostsController };