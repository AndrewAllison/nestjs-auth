export const mockPrismaService = {
  $transaction: jest.fn(),
  user: {
    create: jest.fn(),
    createMany: jest.fn(),
  },
};
