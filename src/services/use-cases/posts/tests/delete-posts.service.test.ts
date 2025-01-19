import { DeletePostsService } from '../delete-posts.service';
import { client } from '../../../../infra/prisma/client';

describe('DeletePostsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a post successfully', async () => {
    const service = new DeletePostsService();
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: true,
    });

    await service.execute({ postId });

    expect(client.posts.update).toHaveBeenCalledWith({
      where: { id: postId },
      data: { active: false },
    });
  });

  it('should throw an error if post not found', async () => {
    const service = new DeletePostsService();
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute({ postId })).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw an error if post is inactive', async () => {
    const service = new DeletePostsService();
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: false,
    });

    await expect(service.execute({ postId })).rejects.toThrow('Usuário não encontrado');
  });
});