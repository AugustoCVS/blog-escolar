import { ICreateUser } from "../domain/interfaces/user";
import { client } from "../infra/prisma/client";
import { emailRegex } from "./regex";


export const validateEmail = ({ email }: ICreateUser) => {
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }
}

export const validateIfUserAlreadyExists = async ({ email }: ICreateUser) => {
  const userAlreadyExists = await client.user.findUnique({
    where: { email },
  });

  if (userAlreadyExists) {
    throw new Error("Email indisponível");
  }
}