import { GetUserService } from '../get-user.service';
import { client } from '../../../../infra/prisma/client';

describe('GetUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user successfully', async () => {
    const service = new GetUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await service.execute({ userId });

    expect(user).toHaveProperty('id', userId);
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  it('should throw an error if user not found', async () => {
    const service = new GetUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute({ userId })).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw an error if user is inactive', async () => {
    const service = new GetUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      active: false,
    });

    await expect(service.execute({ userId })).rejects.toThrow('Usuário não encontrado');
  });
});