const ErrorResponse = require("../Utils/ErrorResponce");
const asyncHandler = require("./async");

const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();
  
    const option = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === "production") {
      option.secure = true;
    }
    res.status(statusCode).cookie("token", token, option).json({
      success: true,
      token,
      user
    });
  };

  module.exports = sendTokenResponse