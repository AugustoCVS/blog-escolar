import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";
import { authorSelect } from "../../../utils/objects";

class GetPostsByAuthorIdService {

  private async listAllPostsByAuthor(authorId: string, page: number = 1, limit: number = 10): Promise<IPosts[]> {
    const skip = (page - 1) * limit;
    const posts = await client.posts.findMany({
      where: {
        authorId,
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      ...authorSelect,
    });

    if (posts.length === 0) {
      throw new Error("Nenhum post encontrado para o autor");
    }

    return posts
  }

  async execute({
    page,
    limit,
    authorId,
  }: IGetPostsInput & IPostsSearchParams): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      return await this.listAllPostsByAuthor(authorId, page, limit);
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsByAuthorIdService };