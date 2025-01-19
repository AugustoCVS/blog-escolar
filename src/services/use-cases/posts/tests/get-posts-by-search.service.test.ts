import { GetPostsBySearchService } from '../get-posts-by-search.service';
import { client } from '../../../../infra/prisma/client';

describe('GetPostsBySearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return posts by search criteria successfully', async () => {
    const service = new GetPostsBySearchService();
    const searchQuery = 'Test';
    const posts = [
      {
        id: '1',
        title: 'Test Post 1',
        content: 'This is a test post about testing.',
        authorId: '1',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Another Test Post',
        content: 'This post is also about testing.',
        authorId: '1',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const result = await service.execute({ searchQuery, page: 1, limit: 10 });

    expect(result).toEqual(posts);
    expect(client.posts.findMany).toHaveBeenCalledWith(expect.objectContaining({
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
      skip: 0,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            isAdmin: true,
          },
        },
      },
    }));
  });

  it('should throw an error if no posts found for the search criteria', async () => {
    const service = new GetPostsBySearchService();
    const searchQuery = 'Nonexistent';

    (client.posts.findMany as jest.Mock).mockResolvedValue([]);

    await expect(service.execute({ searchQuery, page: 1, limit: 10 })).rejects.toThrow('Nenhum post encontrado para a busca');
  });
});