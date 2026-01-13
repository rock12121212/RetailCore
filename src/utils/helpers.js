/**
 * @description Common helper functions
 */

export const generateRandomToken = () => {
  return Math.random().toString(36).substring(2);
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};
