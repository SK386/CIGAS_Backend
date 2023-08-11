const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Connected to the database?");
    // ... you will write your Prisma Client queries here
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