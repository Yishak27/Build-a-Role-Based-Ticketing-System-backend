const { STATUS } = require("../constants/constant");
const bcrypt = require('bcrypt');
const UserSchema = require("../model/UserSchema");
const { errorMessage, successMessage } = require("../constants/messageConstant");
const AttemptSchema = require("../model/AttemptSchema");
class UserService {
    static async createUser(params) {
        try {
            const isExist = await UserSchema.findOne({ userName: params.userName });
            if (isExist) {
                return {
                    status: STATUS.FAILED,
                    message: "User Already Exist with username of " + params.userName + " please use other userName"
                }
            }
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
                    message: "Unable to create user."
                }
            }
        } catch (error) {
            throw new Error('Something went wrong. Unable to create user', error);
        }
    };
    static async login(params) {
        try {
            const user = await UserSchema.findOne({ userName: params.userName });
            if (!user) {
                return {
                    status: STATUS.FAILED,
                    message: errorMessage.USER_NOT_FOUND
                }
            }
            const isMatch = await bcrypt.compare(params.password, user.password);
            if (!isMatch) {
                if (user.neverLock == false) {
                    const attempt = await AttemptSchema.findOne({ userName: user.userName });
                    if (attempt) {
                        if (attempt.attempt >= 5) {
                            user.isLocked = true;
                            await user.save();
                            return {
                                status: STATUS.FAILED,
                                message: errorMessage.USER_LOCKED
                            }
                        } else {
                            attempt.attempt += 1;
                            await attempt.save();
                        }
                    } else {
                        const newAttempt = new AttemptSchema({ userName: user.userName, attempt: 1 });
                        await newAttempt.save();
                    }
                }
                return {
                    status: STATUS.FAILED,
                    message: errorMessage.INVALID_CREDENTIALS
                }
            }

            // set token for user
            const token = await UserUtility.generateAuthToken(user.userName);
            user.token = token;
            user.isActive = true;
            user.lastLogin = Date.now();
            await user.save();
            return {
                status: STATUS.SUCCESS,
                data: user
            }
        } catch (error) {
            throw new Error('Something went wrong. Unable to login user');

        }
    };
    static async setCredentials(res, user) {
        try {
            res.cookie('token', user.token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });

            res.cookie('userName', user.userName, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });
        } catch (error) {
            throw new Error('Something went wrong. Unable to set credentials');
        }
    };
};

const jwt = require('jsonwebtoken');
class UserUtility {
    static async generateAuthToken(userName) {
        try {
            const token = await jwt.sign({ userName },
                process.env.JWT_SECRET,
                { expiresIn: '1h' });
            return token;
        } catch (error) {
            throw new Error('Something went wrong. Unable to generate token');
        }
    }
}
module.exports = UserService;