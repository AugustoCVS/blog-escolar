import { DeleteUserService } from '../delete-user.service';
import { client } from '../../../../infra/prisma/client';

describe('DeleteUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user successfully', async () => {
    const service = new DeleteUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      active: true,
    });

    await service.execute({ userId });

    expect(client.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { active: false },
    });
  });

  it('should throw an error if user not found', async () => {
    const service = new DeleteUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute({ userId })).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw an error if user is inactive', async () => {
    const service = new DeleteUserService();
    const userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: userId,
      active: false,
    });

    await expect(service.execute({ userId })).rejects.toThrow('Usuário não encontrado');
  });
});