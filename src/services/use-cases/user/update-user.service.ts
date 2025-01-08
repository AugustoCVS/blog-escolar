import { IUpdateUser, IUserResponse } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";
import { validateEmail, validateIfUserAlreadyExists } from "../../../utils/validations";

class UpdateUserService {
  private async validateUserInput({ email }: { email: string }): Promise<void> {
    validateEmail(email);
    await validateIfUserAlreadyExists(email);
  }

  async execute(id: string, userData: IUpdateUser): Promise<void> {
    try {
      await this.validateUserInput({
        email: userData.email,
      });

      await client.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      throw new Error("Falha ao atualizar usuário: " + error.message);
    }
  }
}

export { UpdateUserService };
