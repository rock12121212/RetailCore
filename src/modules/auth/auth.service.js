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
  return {
    user: { email, _id: 'dummy_id' },
    accessToken: 'dummy_token'
  };
};
