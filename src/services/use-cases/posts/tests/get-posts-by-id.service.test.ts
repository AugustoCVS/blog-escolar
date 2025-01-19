import { GetPostsByIdService } from '../get-posts-by-id.service';
import { client } from '../../../../infra/prisma/client';

describe('GetPostsByIdService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a post by ID successfully', async () => {
    const service = new GetPostsByIdService();
    const postId = '1';
    const post = {
      id: postId,
      title: 'Test Post',
      content: 'This is a test post.',
      authorId: '1',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue(post);

    const result = await service.execute({ postsId: postId });

    expect(result).toEqual(post);
    expect(client.posts.findUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: postId },
    }));
  });

  it('should throw an error if post not found', async () => {
    const service = new GetPostsByIdService();
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute({ postsId: postId })).rejects.toThrow('Post não encontrado');
  });

  it('should throw an error if post is inactive', async () => {
    const service = new GetPostsByIdService();
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: false,
    });

    await expect(service.execute({ postsId: postId })).rejects.toThrow('Post não encontrado');
  });
});