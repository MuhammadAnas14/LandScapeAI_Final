const asyncHandler = require("../Middleware/async");
const User = require("../Models/user");
const sendTokenResponse = require("../Middleware/AuthTokenResponse");

exports.SignUp = asyncHandler(async (req, res, next) => {
  const { Name, Email, Password } = req.body;
  console.log("name",Name)
  const userEmail = await User.findOne({ email: Email });

  if (!Email || !Password || !Name) {
    return res.status(200).json({
      success: false,
      message: "Please provide ana email and passward",
    });
  }

  if (userEmail) {
    return res.status(200).json({
      success: false,
      message: "User already exit",
    });
  }

  const user = await User.create({
    name: Name,
    email: Email,
    password: Password,
  });

  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { Email, Password } = req.body;

  console.log(req.body);

  //validate
  if (!Email || !Password) {
    return res.status(200).json({
      success: false,
      message: "Please provide ana email and passward",
    });
  }

  const user = await User.findOne({ email: Email });
  console.log(user)
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Invalid credential",
    });
  }
  //passward match
  const isMatch = await user.matchPassword(Password);

  if (!isMatch) {
    return res.status(200).json({
      success: false,
      message: "Invalid credential",
    });
  }

  sendTokenResponse(user, 200, res);
});