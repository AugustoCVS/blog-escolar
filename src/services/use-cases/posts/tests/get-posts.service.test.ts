import { GetPostsService } from '../get-posts.service';
import { client } from '../../../../infra/prisma/client';

describe('GetPostsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return posts successfully', async () => {
    const service = new GetPostsService();
    const posts = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content of post 1',
        authorId: '1',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Content of post 2',
        authorId: '1',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const result = await service.execute({ page: 1, limit: 10 });

    expect(result).toEqual(posts);
    expect(client.posts.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { active: true },
      skip: 0,
      take: 10,
    }));
  });

  it('should throw an error if no posts found', async () => {
    const service = new GetPostsService();

    (client.posts.findMany as jest.Mock).mockResolvedValue([]);

    const result = await service.execute({ page: 1, limit: 10 });

    expect(result).toEqual([]);
  });
});