import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin',
            lastName: 'User',
            username: 'admin',
            password: 'adminpass',
            role: 'ADMIN'
        }
    });

    const regularUser = await prisma.user.create({
        data: {
            name: 'Regular',
            lastName: 'User',
            username: 'user',
            password: 'userpass',
            role: 'USER'
        }
    });

    await prisma.task.createMany({
        data: [
            { title: 'Task 1', description: 'Description for Task 1', priority: 'HIGH', userId: adminUser.id },
            { title: 'Task 2', description: 'Description for Task 2', priority: 'MEDIUM', userId: regularUser.id },
            { title: 'Task 3', description: 'Description for Task 3', priority: 'LOW', userId: regularUser.id }
        ],
        skipDuplicates: true
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