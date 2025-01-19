import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";
import { authorSelect } from "../../../utils/objects";

class GetPostsBySearchService {

  private async searchPosts(searchQuery: string, page: number = 1, limit: number = 10): Promise<IPosts[]> {
    const skip = (page - 1) * limit;

    const posts = await client.posts.findMany({
      where: {
        AND: [
          { active: true },
          {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { content: { contains: searchQuery, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      ...authorSelect,
    });

    if (posts.length === 0) {
      throw new Error("Nenhum post encontrado para a busca");
    }

    return posts;
  }

  async execute({
    page,
    limit,
    searchQuery,
  }: IGetPostsInput & { searchQuery: string }): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      return await this.searchPosts(searchQuery, page, limit);
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsBySearchService };