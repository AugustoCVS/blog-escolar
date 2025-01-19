import { GetPostsByAuthorIdService } from '../get-posts-by-author.service';
import { client } from '../../../../infra/prisma/client';

describe('GetPostsByAuthorIdService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return posts by author successfully', async () => {
    const service = new GetPostsByAuthorIdService();
    const authorId = '1';
    const posts = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content of post 1',
        authorId: authorId,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Content of post 2',
        authorId: authorId,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const result = await service.execute({ authorId, page: 1, limit: 10 });

    expect(result).toEqual(posts);
    expect(client.posts.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        authorId,
        active: true,
      },
      skip: 0,
      take: 10,
    }));
  });

  it('should throw an error if no posts found for the author', async () => {
    const service = new GetPostsByAuthorIdService();
    const authorId = '1';

    (client.posts.findMany as jest.Mock).mockResolvedValue([]);

    await expect(service.execute({ authorId, page: 1, limit: 10 })).rejects.toThrow('Falha ao buscar posts: ');
  });
});