/**
 * Generates a random password with the following criteria:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 */
export function generateRandomPassword(): string {
  const length = 12;
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*'
  };

  // Ensure at least one character from each set
  let password = '';
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

  // Fill the rest with random characters from all sets
  const allChars = Object.values(charset).join('');
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 