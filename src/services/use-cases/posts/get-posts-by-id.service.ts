import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";
import { authorSelect } from "../../../utils/objects";

class GetPostsByIdService {

  private async findPostById(postId: string): Promise<IPosts> {
    const post = await client.posts.findUnique({
      where: { id: postId },
      ...authorSelect,
    });

    if (!post || post.active === false) {
      throw new Error("Post não encontrado");
    }

    return post
  }

  async execute({
    postsId,
  }: IGetPostsInput & IPostsSearchParams): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      return await this.findPostById(postsId);
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsByIdService };