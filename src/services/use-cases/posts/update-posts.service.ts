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
      await client.posts.update({
        where: { id },
        data: postData,
      })
    } catch (error) {
      throw new Error("Falha ao atualizar um post: " + error.message);
    }
  }
}

export { UpdatePostsService };