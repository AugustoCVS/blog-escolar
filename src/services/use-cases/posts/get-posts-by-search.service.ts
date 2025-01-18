import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";
import { authorSelect } from "../../../utils/objects";

class GetPostsBySearchService {

  private async searchPosts({ title, content }: IPostsSearchParams, page: number = 1, limit: number = 10): Promise<IPosts[]> {
    const skip = (page - 1) * limit;
    const posts = await client.posts.findMany({
      where: {
        AND: [
          { active: true },
          {
            OR: [
              { title: { contains: title, mode: 'insensitive' } },
              { content: { contains: content, mode: 'insensitive' } },
            ],
          },
        ],
      },
      skip,
      take: limit,
      ...authorSelect,
    });

    return posts
  }

  async execute({
    page,
    limit,
    title,
    content,
  }: IGetPostsInput & IPostsSearchParams): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      return await this.searchPosts({ title, content }, page, limit);
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsBySearchService };