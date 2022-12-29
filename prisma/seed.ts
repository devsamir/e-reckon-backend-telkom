import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
const prisma = new PrismaClient();

const datelArray = [
  'PEKALONGAN 1',
  'PEKALONGAN 2',
  'BATANG',
  'SLAWI',
  'TEGAL',
  'PEMALANG',
  'BREBES',
];

async function main() {
  // Generate user admin
  const hash = await argon.hash('admin');
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: 'admin',
      password: hash,
      role: 'admin',
      fullname: 'Administrator',
    },
  });

  //   witel
  const witel = await prisma.witel.upsert({
    where: { name: 'PEKALONGAN' },
    update: {},
    create: {
      name: 'PEKALONGAN',
    },
  });
  const datel = await prisma.datel.createMany({
    data: datelArray.map((name) => ({
      name,
      witel_id: witel.id,
    })),
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
