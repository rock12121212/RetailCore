// In a real app, this interacts with the User model
export const registerUser = async (userData) => {
  // Placeholder for DB logic
  return { ...userData, _id: 'dummy_id' };
};

export const loginUser = async ({ email, password }) => {
  // Placeholder for auth logic
  return { 
    user: { email, _id: 'dummy_id' }, 
    accessToken: 'dummy_token' 
  };
};
