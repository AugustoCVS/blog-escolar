import { client } from "../../../infra/prisma/client";

class DeletePostsService {

  async execute({ postId }: { postId: string }): Promise<void> {
    try {
      const post = await client.posts.findUnique({
        where: { id: postId },
      });

      if (!post || post.active === false) {
        throw new Error("Usuário não encontrado");
      }

      await client.posts.update({
        where: { id: postId },
        data: { active: false }
      })
    } catch (error) {
      throw new Error("Falha ao deletar usuário: " + error.message);
    }
  }

}

export { DeletePostsService }