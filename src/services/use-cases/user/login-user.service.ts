import { compare } from "bcryptjs";
import { IUserResponse } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";

class LoginUserService {
  async execute({ email, password }: { email: string; password: string }): Promise<IUserResponse> {
    const user = await client.user.findUnique({
      where: { email },
    });

    if (!user || !user.active) {
      throw new Error("Usuário não encontrado ou inativo");
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    const userResponse: IUserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userResponse;
  }
}

export { LoginUserService }; 