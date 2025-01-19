import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

const client = mockDeep<PrismaClient>();

export { client };