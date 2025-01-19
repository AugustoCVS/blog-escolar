import { UpdatePostsService } from '../update-posts.service';
import { client } from '../../../../infra/prisma/client';
import { IUpdatePost } from '../../../../domain/interfaces/posts';

describe('UpdatePostsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a post successfully', async () => {
    const service = new UpdatePostsService();
    const postId = '1';
    const postData: IUpdatePost = {
      title: 'Updated Post Title',
      content: 'Updated content of the post.',
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValueOnce({
      id: postId,
      active: true,
    });

    (client.posts.update as jest.Mock).mockResolvedValue({
      id: postId,
      ...postData,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.execute({ id: postId, postData });

    expect(client.posts.update).toHaveBeenCalledWith({
      where: { id: postId },
      data: postData,
    });
  });

  it('should throw an error if post not found', async () => {
    const service = new UpdatePostsService();
    const postId = '1';
    const postData: IUpdatePost = {
      title: 'Updated Post Title',
      content: 'Updated content of the post.',
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute({ id: postId, postData })).rejects.toThrow('Post não encontrado');
  });

  it('should throw an error if post is inactive', async () => {
    const service = new UpdatePostsService();
    const postId = '1';
    const postData: IUpdatePost = {
      title: 'Updated Post Title',
      content: 'Updated content of the post.',
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: false,
    });

    await expect(service.execute({ id: postId, postData })).rejects.toThrow('Post não encontrado');
  });
});