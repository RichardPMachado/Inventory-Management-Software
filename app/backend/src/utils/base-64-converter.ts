import { IUserPayload } from '@/auth/models/IUserPayload';

export const authorizantionToLoginPayload = (
  authorization: string,
): IUserPayload | undefined => {
  const authorizationSplited = authorization.split('.');
  console.log(authorizationSplited);

  if (authorizationSplited.length < 3 || !authorizationSplited[1]) {
    return undefined;
  }

  return JSON.parse(
    Buffer.from(authorizationSplited[1], 'base64').toString('ascii'),
  );
};
