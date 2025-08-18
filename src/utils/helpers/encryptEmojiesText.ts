import * as crypto from 'crypto';

// Algorithm
const ALGORITHM = 'aes-256-cbc';

// Use a persistent 32-byte key (Base64 in .env)
const SECRET_KEY = Buffer.from(process.env.EMOJI_SECRET_KEY!, 'base64');

// Encrypt function
export function encryptEmojieText(text: string): string {
  const iv = crypto.randomBytes(16); // fresh IV for each message
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encryptedText = cipher.update(text, 'utf-8', 'base64');
  encryptedText += cipher.final('base64');
  return `${iv.toString('base64')}:${encryptedText}`;
}

// Decrypt function
export function decryptEmojieText(encryptedText: string): string {
  const [ivString, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivString, 'base64');

  if (iv.byteLength !== 16) {
    throw new Error(`Invalid IV length: ${iv.byteLength}`);
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
