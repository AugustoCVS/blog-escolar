import { hash } from "bcryptjs";
import { ICreateUser } from "../../../domain/interfaces/user";
import { client } from "../../../infra/prisma/client";
import { emailRegex } from "../../../utils/regex";

class CreateUserService {
  private async validateEmptyFields(user: ICreateUser) {
    const { isAdmin, ...otherFields } = user;

    if (Object.values(otherFields).some(value => !value) || isAdmin === undefined) {
      throw new Error("Todos os campos são obrigatórios");
    }
  }

  private async validateEmail({ email }: ICreateUser) {
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }
  }

  private async validatePassword({ password, confirm_password }: ICreateUser) {
    if (password !== confirm_password) {
      throw new Error("As senhas não coincidem");
    }
  }

  private async validateIfUserAlreadyExists({ email }: ICreateUser) {
    const userAlreadyExists = await client.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("Email indisponível");
    }
  }

  private async validateInputs(user: ICreateUser) {
    await this.validateEmptyFields(user);
    await this.validateEmail(user);
    await this.validatePassword(user);
    await this.validateIfUserAlreadyExists(user);
  }

  async execute(user: ICreateUser) {
    try {
      await this.validateInputs(user);

      const passwordHash = await hash(user.password, 8);
      const createdUser = await client.user.create({
        data: {
          ...user,
          password: passwordHash,
          confirm_password: passwordHash,
        },
      });

      return createdUser;
    } catch (error) {
      throw new Error("Falha ao criar usuário: " + error.message);
    }
  }
}

export { CreateUserService };