import { CreateUserService } from '../create-user.service';
import { client } from '../../../../infra/prisma/client';
import { ICreateUser } from '../../../../domain/interfaces/user';

describe('CreateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const service = new CreateUserService();
    const userData: ICreateUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
      password: 'password',
      confirm_password: 'password',
    };

    (client.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      ...userData,
      password: 'hashed_password',
    });

    const user = await service.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
    expect(client.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        name: userData.name,
        email: userData.email,
        password: expect.any(String),
      }),
    }));
  });

  it('should throw an error if email already exists', async () => {
    const service = new CreateUserService();
    const userData: ICreateUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
      password: 'password',
      confirm_password: 'password',
    };

    (client.user.findUnique as jest.Mock).mockResolvedValueOnce(userData);

    await expect(service.execute(userData)).rejects.toThrow('Email indisponível');
  });

  it('should throw an error if email is invalid', async () => {
    const service = new CreateUserService();
    const userData: ICreateUser = {
      id: '1',
      name: 'Test User',
      email: 'invalid_email',
      isAdmin: false,
      password: 'password',
      confirm_password: 'password',
    };

    await expect(service.execute(userData)).rejects.toThrow('Email inválido');
  })

  it('should throw an error if any value is missing', async () => {
    const service = new CreateUserService();
    const userData: ICreateUser = {
      id: '1',
      name: 'Test User',
      email: '',
      isAdmin: false,
      password: 'password',
      confirm_password: 'password',
    };

    await expect(service.execute(userData)).rejects.toThrow('Todos os campos são obrigatórios');
  });

  it('should throw an error if password and confirm_password do not match', async () => {
    const service = new CreateUserService();
    const userData: ICreateUser = {
      id: '1',
      name: 'Test User',
      email: 'teste@example.com',
      isAdmin: false,
      password: 'password',
      confirm_password: 'password123',
    };

    await expect(service.execute(userData)).rejects.toThrow('As senhas não coincidem');
  });

});