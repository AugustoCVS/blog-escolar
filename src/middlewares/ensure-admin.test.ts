
import { Request, Response, NextFunction } from 'express';
import { client } from '../infra/prisma/client';
import { ensureIsAdmin } from './ensure-admin';

describe('ensureIsAdmin Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next if user is admin', async () => {
    req.query.userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      active: true,
      isAdmin: true,
    });

    await ensureIsAdmin(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if userId is not provided', async () => {
    await ensureIsAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'UserId não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    req.query.userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue(null);

    await ensureIsAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not active', async () => {
    req.query.userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      active: false,
    });

    await ensureIsAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not an admin', async () => {
    req.query.userId = '1';

    (client.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      active: true,
      isAdmin: false,
    });

    await ensureIsAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não é administrador' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if there is an error during the check', async () => {
    req.query.userId = '1';

    (client.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

    await ensureIsAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao verificar permissões' });
    expect(next).not.toHaveBeenCalled();
  });
});