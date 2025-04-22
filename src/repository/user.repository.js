import UserDAO from "../dao/models/user.dao.js";
import { UserDTO } from "../dao/dto/user.dto.js";

const userDAO = new UserDAO();

export default class UserRepository {
async getUserById(id) {
    const user = await userDAO.getById(id);
    return new UserDTO(user);
}
}