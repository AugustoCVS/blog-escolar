import { CreatePostsService } from '../create-posts.service';
import { client } from '../../../../infra/prisma/client';
import { ICreatePost } from '../../../../domain/interfaces/posts';

describe('CreatePostsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post successfully', async () => {
    const service = new CreatePostsService();
    const postData: ICreatePost = {
      title: 'Test Post',
      content: 'This is a test post.',
      authorId: '1',
    };

    (client.posts.create as jest.Mock).mockResolvedValue({
      id: '1',
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.execute(postData);
    ;
    expect(client.posts.create).toHaveBeenCalledWith({
      data: postData,
    });
  });

  it('should throw an error if any value is missing', async () => {
    const service = new CreatePostsService();
    const postData: ICreatePost = {
      title: '',
      content: 'This is a test post.',
      authorId: '1',
    };

    await expect(service.execute(postData)).rejects.toThrow('Todos os campos são obrigatórios');
  });
});
