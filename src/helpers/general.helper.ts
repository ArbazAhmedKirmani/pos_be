import { hashString } from './hashAndEncrypt.helper';

export function generateRandomPassword(length: number = 6): any {
  const characters = '0123456789';
  let password: string = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  const hashed_password = hashString(password);
  return hashed_password;
}
