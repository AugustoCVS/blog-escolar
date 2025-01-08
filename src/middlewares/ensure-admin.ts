import { Request, Response, NextFunction } from "express";
import { client } from "../infra/prisma/client";

export async function ensureIsAdmin(request: Request, response: Response, next: NextFunction): Promise<any> {
  const userId = request.query.userId as string;

  if (!userId) {
    return response.status(401).json({ error: 'UserId não fornecido' });
  }

  try {
    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.active) {
      return response.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.isAdmin) {
      return response.status(401).json({ error: 'Usuário não é administrador' });
    }

    return next();
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao verificar permissões' });
  }
}