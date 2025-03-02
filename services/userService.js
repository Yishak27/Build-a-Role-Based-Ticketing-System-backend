const { STATUS } = require("../constants/constant");
const bcrypt = require('bcrypt');
const UserSchema = require("../model/UserSchema");
const { errorMessage, successMessage } = require("../constants/messageConstant");
class UserService {
    static async createUser(params) {
        try {
            const salt = await bcrypt.genSalt(10);
            console.log('body', params);
            params.password = await bcrypt.hash(params.password, salt);
            const user = new UserSchema(params);
            await user.save();
            if (user) {
                return {
                    status: STATUS.SUCCESS,
                    data: user,
                }
            } else {
                return {
                    status: STATUS.FAILED,
                }
            }
        } catch (error) {
            throw new Error('Something went wrong. Unable to create user', error);
        }
    };
};

module.exports = UserService;