import { hash } from "bcryptjs";
import { ICreateUser } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";
import { validateEmail, validateIfUserAlreadyExists } from "../../../utils/validations";

class CreateUserService {
  private async validateEmptyFields(user: ICreateUser): Promise<void> {
    const { isAdmin, ...otherFields } = user;

    if (Object.values(otherFields).some(value => !value) || isAdmin === undefined) {
      throw new Error("Todos os campos são obrigatórios");
    }
  }

  private async validatePassword({ password, confirm_password }: ICreateUser): Promise<void> {
    if (password !== confirm_password) {
      throw new Error("As senhas não coincidem");
    }
  }

  private async validateInputs(user: ICreateUser): Promise<void> {
    await this.validateEmptyFields(user);
    await this.validatePassword(user);
    await validateIfUserAlreadyExists(user.email);
    validateEmail(user.email);
  }

  async execute(user: ICreateUser): Promise<ICreateUser> {
    try {
      await this.validateInputs(user);

      const passwordHash = await hash(user.password, 8);
      const newUser = await client.user.create({
        data: {
          ...user,
          password: passwordHash,
          confirm_password: passwordHash,
        },
      });

      return newUser;
    } catch (error) {
      throw new Error("Falha ao criar usuário: " + error.message);
    }
  }
}

export { CreateUserService };