import { Request, Response } from "express";
import { CreateUserService } from "../../../services/use-cases/user/create-user.service";
import { GetUserService } from "../../../services/use-cases/user/get-user.service";
import { UpdateUserService } from "../../../services/use-cases/user/update-user.service";
import { DeleteUserService } from "../../../services/use-cases/user/delete-user.service";
import { LoginUserService } from "../../../services/use-cases/user/login-user.service";
import { GetAllUsersService } from "../../../services/use-cases/user/get-all-users.service";

class UserController {
  async createUser(request: Request, response: Response) {
    const { name, email, isAdmin, password, confirm_password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      isAdmin,
      password,
      confirm_password,
    });

    return response.json(user);
  }

  async getUserById(request: Request, response: Response) {
    const { id } = request.params;

    const getUserUseCase = new GetUserService();

    const user = await getUserUseCase.execute({
      userId: id,
    });

    return response.json(user);
  }

  async updateUser(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email } = request.body;

    const updateUserUseCase = new UpdateUserService();

    const user = await updateUserUseCase.execute(id, {
      name,
      email,
    });

    return response.json(user);
  }

  async deleteUser(request: Request, response: Response) {
    const { id } = request.params;

    const deleteUserUseCase = new DeleteUserService();

    await deleteUserUseCase.execute({
      userId: id,
    });

    return response.status(204).send();
  }

  async loginUser(request: Request, response: Response) {
    const { email, password } = request.body;

    const loginUserService = new LoginUserService();

    try {
      const user = await loginUserService.execute({ email, password });
      return response.json(user);
    } catch (error) {
      return response.status(401).json({ error: error.message });
    }
  }

  async getAllUsers(request: Request, response: Response) {
    const getUserUseCase = new GetAllUsersService();

    const users = await getUserUseCase.execute();

    return response.json(users);
  }
}

export { UserController };
