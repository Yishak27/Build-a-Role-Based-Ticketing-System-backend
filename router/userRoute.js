const express = require("express");
const axios = require("axios");
const userRouter = express.Router();
const statusConstant = require('../constants/statusConstant');
const { successMessage, errorMessage } = require('../constants/messageConstant');
const UserService = require("../services/userService");
const { STATUS } = require("../constants/constant");
const UserSchema = require("../model/UserSchema");
const AttemptSchema = require("../model/AttemptSchema");
const { userCreationValidator } = require("../middleware/inputHandler");
const { handleValidation } = require("../controllers/handler/handleValidation");

userRouter.use('/get', (req, res) => {
  return res.status(statusConstant.OK).send({
    message: "Done"
  });
});

userRouter.post("/signup",
  userCreationValidator,
  handleValidation,
  async (req, res) => {
    try {
      const result = await UserService.createUser(req.body);
      if (result && result.status === STATUS.SUCCESS) {
        return res.status(statusConstant.CREATED).send({
          status: STATUS.SUCCESS,
          message: successMessage.USER_CREATED,
          data: result.data
        });
      }
      else {
        return res.status(statusConstant.INTERNAL_SERVER_ERROR).send({
          status: STATUS.FAILED,
          message: result.message
        });
      }
    } catch (error) {
      console.log('Error in creating user', error);
      return res.status(statusConstant.INTERNAL_SERVER_ERROR).send({
        status: STATUS.FAILED,
        message: errorMessage.INTERNAL_SERVER_ERROR
      });
    }
  });

userRouter.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(statusConstant.BAD_REQUEST).send({
        status: STATUS.FAILED,
        message: errorMessage.PROVIDE_REQUIRED_FIELDS
      });
    }
    const result = await UserService.login(req.body);
    // after login is successfull, give auth token, set cookies, and return user details
    if (result && result.status === STATUS.SUCCESS) {
      await UserService.setCredentials(res, result.data);

      return res.status(statusConstant.OK).send({
        status: STATUS.SUCCESS,
        message: "Login successfully.",
        data: result.data
      });
    } else {
      return res.status(statusConstant.CREATED).send({
        status: STATUS.FAILED,
        message: result.message
      });
    }
  } catch (error) {
    return res.status(statusConstant.INTERNAL_SERVER_ERROR).send({
      status: STATUS.FAILED,
      message: errorMessage.INTERNAL_SERVER_ERROR
    });
  }
});
userRouter.get('/logout', async (req, res) => {
  try {
    const user = req.cookies.userName;
    if (user) {
      res.clearCookie("token")
      res.clearCookie("userName")
    }
    return res.status(200).send({
      status: true,
      message: "Log out successfully",
    })
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "internal server error",
    })
  }
})
module.exports = userRouter;
