import { UpdateUserService } from '../update-user.service';
import { client } from '../../../../infra/prisma/client';
import { IUpdateUser } from '../../../../domain/interfaces/user';

describe('UpdateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('should update a user successfully', async () => {
    const service = new UpdateUserService();
    const userId = '1';
    const userData: IUpdateUser = {
      email: 'updated@example.com',
      name: 'Updated User',
      isAdmin: false,
    };

    // Mock da resposta do Prisma Client para o usuário existente
    (client.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: userId,
      active: true,
      email: 'original@example.com',
    });

    // Mock da validação de e-mail para garantir que o e-mail não existe
    (client.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await service.execute(userId, userData);

    expect(client.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: userData,
    });
  });

  it('should throw an error if user not found', async () => {
    const service = new UpdateUserService();
    const userId = '1';
    const userData: IUpdateUser = {
      email: 'updated@example.com',
      name: 'Updated User',
      isAdmin: false,
    };

    // Simula que o usuário não existe
    (client.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.execute(userId, userData)).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw an error if email already exists', async () => {
    const service = new UpdateUserService();
    const userId = '1';
    const userData: IUpdateUser = {
      email: 'existing@example.com',
      name: 'Updated User',
      isAdmin: false,
    };

    // Mock da resposta do Prisma Client para o usuário existente
    (client.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: userId,
      active: true,
      email: 'original@example.com',
    });

    // Simula que o e-mail já está em uso
    (client.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '2',
      email: 'existing@example.com',
      active: true,
    });

    await expect(service.execute(userId, userData)).rejects.toThrow('Email indisponível');
  });
});