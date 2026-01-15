import { User } from "../user/user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const registerUser = async (userData) => {
  const user = await User.findOne({
    $or: [
      { email: userData.email },
      { username: userData.username },
    ],
  })

  if (user) {
    const isEmailDuplicate = user.email === userData.email;
    const field = isEmailDuplicate ? 'email' : 'username';
    throw new ApiError(400, `User with this ${field} already exists`, [
      {
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`,
      },
    ]);
  }

  const newUser = await User.create(userData)

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const accessToken = user.generateAccessToken();

  return {
    user: { _id: user._id, email: user.email, username: user.username, role: user.role },
    accessToken
  };
};
