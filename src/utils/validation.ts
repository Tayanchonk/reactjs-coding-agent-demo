export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function validateNewPassword(password: string): {
  haslength: boolean;
  hasUpperLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
} {
  const haslength = password.length >= 8;
  const hasUpperLowerCase = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    haslength,
    hasUpperLowerCase,
    hasNumber,
    hasSpecialCharacter,
  };
}

export const validatePassword = (password: string) => {
  return password.length >= 8;
};
