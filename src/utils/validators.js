/**
 * Shared validation logic for inputs across the app
 */

export const isValidEmail = (email) => {
  const re = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

export const isSecurePassword = (password) => {
  // Requires minimum 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/;
  return re.test(password);
};

export const sanitizeMedicalInput = (input) => {
  return input.replace(/[<>]/g, '').trim();
};
