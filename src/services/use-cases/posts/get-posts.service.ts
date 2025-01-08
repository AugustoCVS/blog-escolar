import { IPosts, IPostResponse, IGetPostsInput, IPostsSearchParams } from "../../../domain/interfaces/posts";
import { client } from "../../../infra/prisma/client";

class GetPostsService {
  private readonly authorSelect = {
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  } as const;

  private async findPostById(postId: string): Promise<IPosts> {
    const post = await client.posts.findUnique({
      where: { id: postId },
      ...this.authorSelect,
    });

    if (!post || post.active === false) {
      throw new Error("Post não encontrado");
    }

    return post as IPosts;
  }

  private async searchPosts({ title, content }: IPostsSearchParams): Promise<IPosts[]> {
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
      ...this.authorSelect,
    });

    return posts as IPosts[];
  }

  private async listPosts(page: number = 1, limit: number = 10): Promise<IPostResponse> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.posts.findMany({
        where: { active: true },
        skip,
        take: limit,
        ...this.authorSelect,
        orderBy: { createdAt: 'desc' },
      }),
      client.posts.count({ where: { active: true } }),
    ]);

    return {
      transactions: posts as IPosts[],
      metadata: {
        total,
        page,
        limit,
      },
    };
  }

  private async listAllPosts(): Promise<IPosts[]> {
    const posts = await client.posts.findMany({
      where: { active: true },
      ...this.authorSelect,
    });

    return posts as IPosts[];
  }

  async execute({
    postsId,
    page,
    limit,
    title,
    content,
  }: IGetPostsInput & IPostsSearchParams): Promise<IPostResponse | IPosts | IPosts[]> {
    try {
      if (postsId) {
        return await this.findPostById(postsId);
      }

      if (title || content) {
        return await this.searchPosts({ title, content });
      }

      if (page && limit) {
        return await this.listPosts(page, limit);
      }

      return await this.listAllPosts();
    } catch (error) {
      throw new Error("Falha ao buscar posts: " + error.message);
    }
  }
}

export { GetPostsService };