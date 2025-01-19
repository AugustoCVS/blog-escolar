import { IUpdatePost } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";

class UpdatePostsService {
  async execute({
    id,
    postData,
  }: {
    id: string;
    postData: IUpdatePost;
  }): Promise<void> {
    try {
      const post = await client.posts.findUnique({
        where: { id },
      });

      if (!post || post.active === false) {
        throw new Error("Post não encontrado");
      }

      await client.posts.update({
        where: { id },
        data: postData,
      });
    } catch (error) {
      throw new Error("Falha ao atualizar um post: " + error.message);
    }
  }
}

export { UpdatePostsService };