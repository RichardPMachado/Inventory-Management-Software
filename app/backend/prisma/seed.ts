import { PrismaClient } from '@prisma/client';

import { userSeed } from '../src/data/userSeed';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: userSeed,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
