import * as bcrypt from 'bcrypt';
import { createDecipheriv, randomBytes, scrypt } from 'crypto';
import { ENV_CONSTANTS } from 'src/constants/env.constant';
import { promisify } from 'util';

const iv = randomBytes(16);

/**
 * This function is used to generate a random HASH string from the given string
 * @param string Provide a random string to make the hash
 * @returns Hash string for the given string
 */
export async function hashString(string: string): Promise<string> {
  const saltOrRounds = await bcrypt.genSalt();
  const hash = await bcrypt.hash(string, saltOrRounds);
  return hash;
}

/**
 * This function compares encrypted string against a string
 * @param string Provide text for encrypted string comparison
 * @param encryptedString Provide encrypted string
 * @returns Boolean value indicating whether the string is equal to the provided encrypted string
 */
export async function compareHashString(
  string: string,
  encryptedString: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(string, encryptedString);
  return isMatch;
}

/**
 * This function decrypts an encrypted string
 * @param encryptedText Provide encrypted text for decryption
 * @returns a decrypted string generated from the encrypted string
 */
export async function decryptText(encryptedText) {
  const key = (await promisify(scrypt)(
    ENV_CONSTANTS.ENCRYPTION.PASSWORD,
    'salt',
    32,
  )) as Buffer;
  const decipher = createDecipheriv(
    ENV_CONSTANTS.ENCRYPTION.ALGORITHM,
    key,
    iv,
  );
  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decryptedText;
}
