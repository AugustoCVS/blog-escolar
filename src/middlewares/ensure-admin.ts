import { Request, Response, NextFunction } from "express";

export function ensureIsAdmin(request: Request, response: Response, next: NextFunction) {
  const isAdmin = request.body.isAdmin;

  if (isAdmin) {
    return next();
  }

  return response.status(401).json({ error: 'Usuário não autorizado' });
}