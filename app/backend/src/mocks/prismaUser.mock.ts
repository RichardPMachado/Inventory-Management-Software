import { MockUser } from './createUser.mock';

export const mockPrisma = {
  user: {
    findUnique: jest.fn().mockImplementation(({ where: prop }) => {
      const type = Object.keys(prop)[0];
      return MockUser.find((e) => e[type] === prop[type].toString());
    }),
    create: jest.fn(({ data }) => ({
      id: 12,
      ...data,
      password: undefined,
      createdAt: '2023-07-18T01:54:18.864Z',
      updatedAt: '2023-07-18T01:54:18.864Z',
    })),
    findMany: jest.fn().mockResolvedValue(MockUser),
    update: jest.fn().mockImplementation(async (prop) => {
      const { email } = prop.where;
      const user = MockUser.find((e) => e.email === email);
      return { ...user, ...prop.data };
    }),
    delete: jest.fn().mockImplementation(({ where: prop }) => {
      const type = Object.keys(prop)[0];
      const user = MockUser.find((e) => e[type] === prop[type].toString());
      console.log(user);

      if (!user) {
        return 'The user was deleted';
      }
    }),
  },
};
