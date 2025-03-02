const express = require("express");
const axios = require("axios");
const userRouter = express.Router();
const statusConstant = require('../constants/statusConstant');
const { successMessage, errorMessage } = require('../constants/messageConstant');
const UserService = require("../services/userService");
const { STATUS } = require("../constants/constant");
const UserSchema = require("../model/UserSchema");
const AttemptSchema = require("../model/AttemptSchema");

userRouter.use('/get', (req, res) => {
  return res.status(statusConstant.OK).send({
    message: "Done"
  });
});

userRouter.post("/createUser",
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

module.exports = userRouter;
