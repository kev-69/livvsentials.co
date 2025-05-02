import { prisma } from '../shared/prisma'
import * as bcrytp from 'bcrypt'

async function main() {
    // create sample users
    // create sample users adresses
    // create sample categories
    // create sample products
    // create sample cart
    // create sample orders
    // create sample order items
    // create sample payment

    console.log('Database has successfully been populated with sample data');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }
)