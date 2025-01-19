jest.mock('./src/infra/prisma/client', () => ({
  client: require('./src/tests/mocks/prismaMock').client,
}));