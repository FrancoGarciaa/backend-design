import UserModel from "../../models/users.model.js";

export default class UserDAO {
async getById(id) {
    return await UserModel.findById(id);
}

async getByEmail(email) {
    return await UserModel.findOne({ email });
}

async create(data) {
    const user = new UserModel(data);
    return await user.save();
}
}