import { IUpdateUser, IUserResponse } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";
import { validateEmail, validateIfUserAlreadyExists } from "../../../utils/validations";

class UpdateUserService {
  private async validateUserInput({ email }: { email: string }): Promise<void> {
    validateEmail(email);
    await validateIfUserAlreadyExists(email);
  }

  async execute(id: string, userData: IUpdateUser): Promise<IUserResponse> {
    try {
      await this.validateUserInput({
        email: userData.email,
      });

      const updatedUser = await client.user.update({
        where: { id },
        data: userData,
      });

      const newUser: IUserResponse = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      return newUser;
    } catch (error) {
      throw new Error("Falha ao atualizar usuário: " + error.message);
    }
  }
}

export { UpdateUserService };
