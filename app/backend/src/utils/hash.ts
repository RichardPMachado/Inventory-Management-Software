import * as bcrypt from 'bcrypt';

export const createHash = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  const passworHash = await bcrypt.hash(password, saltOrRounds);
  return passworHash;
};

export const validateHash = async (
  password: string,
  currentUserPassword: string,
): Promise<boolean> => {
  const isPasswordValid = bcrypt.compareSync(password, currentUserPassword);

  return isPasswordValid;
};
