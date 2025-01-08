import { ICreatePost } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";

class CreatePostsService {
  private async validateEmptyFields(posts: ICreatePost): Promise<void> {
    if (Object.values(posts).some(value => !value)) {
      throw new Error("Todos os campos são obrigatórios");
    }
  }

  async execute(posts: ICreatePost): Promise<void> {
    try {
      await this.validateEmptyFields(posts);

      await client.posts.create({
        data: {
          title: posts.title,
          content: posts.content,
          authorId: posts.authorId,
        },
      })

    } catch (error) {
      throw new Error("Falha ao criar um post: " + error.message);
    }
  }
}

export { CreatePostsService };