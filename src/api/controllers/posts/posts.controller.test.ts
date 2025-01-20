import request from 'supertest';
import { app, server } from '../../../server';
import { client } from '../../../infra/prisma/client';

describe('Posts Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const adminUserId = 'admin-id';

  beforeAll(() => {
    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: adminUserId,
      active: true,
      isAdmin: true,
    });
  });

  afterAll(async () => {
    await client.$disconnect();
    server.close()
  });

  it('should create a post successfully', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a test post.',
      authorId: '1',
    };

    (client.posts.create as jest.Mock).mockResolvedValue({
      id: '1',
      ...postData,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    const response = await request(app)
      .post('/posts')
      .query({ userId: adminUserId })
      .send(postData);

    expect(response.status).toBe(201);
  });

  it('should return an error if any value is missing when creating a post', async () => {
    const postData = {
      title: '',
      content: 'This is a test post.',
      authorId: '1',
    };

    const response = await request(app)
      .post('/posts')
      .query({ userId: adminUserId })
      .send(postData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Falha ao criar um post: Todos os campos são obrigatórios');
  });

  it('should get a post by ID successfully', async () => {
    const postId = '1';
    const post = {
      id: postId,
      title: 'Test Post',
      content: 'This is a test post.',
      authorId: '1',
      active: true,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue(post);

    const response = await request(app)
      .get(`/posts/list/${postId}`)
      .query({ userId: adminUserId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(post);
  });

  it('should return an error if post not found', async () => {
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get(`/posts/list/${postId}`)
      .query({ userId: adminUserId });

    expect(response.body.error).toBe('Falha ao buscar posts: Post não encontrado');
  });

  it('should update a post successfully', async () => {
    const postId = '1';
    const postData = {
      title: 'Updated Post Title',
      content: 'Updated content of the post.',
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: true,
    });

    (client.posts.update as jest.Mock).mockResolvedValue({
      id: postId,
      ...postData,
      active: true,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    const response = await request(app)
      .put(`/posts/update/${postId}`)
      .query({ userId: adminUserId })
      .send(postData);

    expect(response.status).toBe(204);
  });

  it('should return an error if post not found when updating', async () => {
    const postId = '1';
    const postData = {
      title: 'Updated Post Title',
      content: 'Updated content of the post.',
    };

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put(`/posts/update/${postId}`)
      .query({ userId: adminUserId })
      .send(postData);

    expect(response.body.error).toBe('Falha ao atualizar um post: Post não encontrado');
  });

  it('should delete a post successfully', async () => {
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue({
      id: postId,
      active: true,
    });

    const response = await request(app)
      .delete(`/posts/${postId}`)
      .query({ userId: adminUserId });

    expect(response.status).toBe(204);
    expect(client.posts.update).toHaveBeenCalledWith({
      where: { id: postId },
      data: { active: false },
    });
  });

  it('should return an error if post not found when deleting', async () => {
    const postId = '1';

    (client.posts.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete(`/posts/${postId}`)
      .query({ userId: adminUserId });

    expect(response.body.error).toBe('Falha ao deletar usuário: Usuário não encontrado');
  });

  it('should return posts successfully', async () => {
    const page = 1;
    const limit = 10;
    const posts = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content of post 1',
        authorId: '1',
        active: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Content of post 2',
        authorId: '1',
        active: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const response = await request(app)
      .get('/posts/list')
      .query({ page, limit, userId: adminUserId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(posts);
  });

  it('should return posts by author successfully', async () => {
    const authorId = '1';
    const page = 1;
    const limit = 10;
    const posts = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content of post 1',
        authorId: authorId,
        active: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const response = await request(app)
      .get('/posts/author')
      .query({ userId: adminUserId, page, limit });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(posts);
  });

  it('should return posts by search query successfully', async () => {
    const searchQuery = 'Test';
    const page = 1;
    const limit = 10;
    const posts = [
      {
        id: '1',
        title: 'Test Post',
        content: 'This is a test post.',
        authorId: '1',
        active: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      },
    ];

    (client.posts.findMany as jest.Mock).mockResolvedValue(posts);

    const response = await request(app)
      .get('/posts/search')
      .query({ userId: adminUserId, searchQuery, page, limit });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(posts);
  });
});