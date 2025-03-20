import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";
import { authorSelect } from "../../../utils/objects";

class GetPostsService {

  private async listAllPosts(page: number = 1, limit: number = 10): Promise<IPosts[]> {
    const skip = (page - 1) * limit;
    const posts = await client.posts.findMany({
      where: { active: true },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      ...authorSelect
    });

    if (posts.length === 0) {
      return [];
    }

    return posts
  }

  async execute({
    page,
    limit,
  }: IGetPostsInput & IPostsSearchParams): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      return await this.listAllPosts(page, limit);
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsService };