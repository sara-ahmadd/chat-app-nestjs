import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

export const hashText = async (
  text: string,
  saltRound = process.env.SALT_ROUND!,
) => {
  const hash = await bcrypt.hash(text, Number(saltRound));
  return hash;
};

export const compareHash = async (text: string, hashedText: string) => {
  const isMatch = await bcrypt.compare(text, hashedText);
  return isMatch;
};
