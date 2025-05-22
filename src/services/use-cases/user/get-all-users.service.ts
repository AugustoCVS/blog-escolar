import { IUserResponse } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";

class GetAllUsersService {
  async execute(): Promise<IUserResponse[]> {
    try {

      const users = await client.user.findMany({
        where: { active: true },
      });

      if (!users || users.length === 0) {
        throw new Error("Nenhum usuário encontrado");
      }

      const userResponse: IUserResponse[] = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return userResponse;
      
    } catch (error) {
      throw new Error("Falha ao buscar usuário: " + error.message);
    }
  }
}

export { GetAllUsersService };
