jest.mock('./infra/prisma/client', () => ({
  client: require('./tests/mocks/prismaMock').client,
}));