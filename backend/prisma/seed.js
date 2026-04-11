const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // --- Seed Orgs (Premium Domains) ---
    const org = await prisma.org.upsert({
        where: { domainName: 'iiitk.ac.in' },
        update: {},
        create: { domainName: 'iiitk.ac.in', isActive: true },
    });
    console.log('  ✓ Org:', org.domainName);

    // --- Seed Admin User ---
    const admin = await prisma.user.upsert({
        where: { email: 'admin@openshelf.dev' },
        update: {},
        create: {
            email: 'admin@openshelf.dev',
            name: 'Admin User',
            role: 'ADMIN',
            isPremium: true,
        },
    });
    console.log('  ✓ Admin:', admin.email);

    // --- Seed Regular User ---
    const user = await prisma.user.upsert({
        where: { email: 'ayan@iiitk.ac.in' },
        update: {},
        create: {
            email: 'ayan@iiitk.ac.in',
            name: 'Ayan',
            role: 'USER',
            isPremium: true, // Domain-based premium
        },
    });
    console.log('  ✓ User:', user.email);

    // --- Seed Books ---
    const books = [
        {
            isbn: '978-0-262-03384-8',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen',
            genre: 'Computer Science',
            publisher: 'MIT Press',
            edition: '3rd',
            year: 2009,
            description: 'A comprehensive textbook covering a broad range of algorithms.',
            isDigital: false,
            physicalCount: 5,
            shelfLocation: 'Shelf-A1',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-0-13-468599-1',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            genre: 'Software Engineering',
            publisher: 'Pearson',
            edition: '1st',
            year: 2008,
            description: 'A handbook of agile software craftsmanship.',
            isDigital: true,
            physicalCount: 3,
            digitalCount: 1,
            shelfLocation: 'Shelf-B2',
            status: 'AVAILABLE',
            rentPrice: 10.0,
            price: 50.0,
        },
        {
            isbn: '978-0-201-63361-0',
            title: 'Design Patterns',
            author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
            genre: 'Computer Science',
            publisher: 'Addison-Wesley',
            edition: '1st',
            year: 1994,
            description: 'Elements of reusable object-oriented software.',
            isDigital: false,
            physicalCount: 0,
            shelfLocation: 'Shelf-A3',
            status: 'BORROWED',
        },
        {
            isbn: '978-1-491-95028-0',
            title: "You Don't Know JS",
            author: 'Kyle Simpson',
            genre: 'Web Development',
            publisher: "O'Reilly Media",
            edition: '1st',
            year: 2015,
            description: 'A deep dive into the core mechanisms of JavaScript.',
            isDigital: true,
            physicalCount: 8,
            digitalCount: 1,
            shelfLocation: 'Shelf-C1',
            status: 'AVAILABLE',
            rentPrice: 5.0,
            price: 30.0,
        },
        {
            isbn: '978-1-59327-584-6',
            title: 'Eloquent JavaScript',
            author: 'Marijn Haverbeke',
            genre: 'Web Development',
            publisher: 'No Starch Press',
            edition: '3rd',
            year: 2018,
            description: 'A modern introduction to programming with JavaScript.',
            isDigital: true,
            physicalCount: 12,
            digitalCount: 1,
            shelfLocation: 'Shelf-C2',
            status: 'AVAILABLE',
            rentPrice: 5.0,
            price: 25.0,
        },
        {
            isbn: '978-0-596-51774-8',
            title: 'JavaScript: The Good Parts',
            author: 'Douglas Crockford',
            genre: 'Web Development',
            publisher: "O'Reilly Media",
            edition: '1st',
            year: 2008,
            description: 'Most programming languages contain good and bad parts. This book focuses on the good parts of JavaScript.',
            isDigital: true,
            physicalCount: 4,
            digitalCount: 1,
            shelfLocation: 'Shelf-C3',
            status: 'AVAILABLE',
            price: 20.0,
        },
        {
            isbn: '978-0-13-235088-4',
            title: 'Operating System Concepts',
            author: 'Abraham Silberschatz',
            genre: 'Computer Science',
            publisher: 'Wiley',
            edition: '10th',
            year: 2018,
            description: 'Comprehensive guide to operating system concepts.',
            isDigital: false,
            physicalCount: 6,
            shelfLocation: 'Shelf-A2',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-0-07-352332-3',
            title: 'Database System Concepts',
            author: 'Abraham Silberschatz',
            genre: 'Computer Science',
            publisher: 'McGraw-Hill',
            edition: '7th',
            year: 2019,
            description: 'A comprehensive introduction to database system concepts.',
            isDigital: false,
            physicalCount: 4,
            shelfLocation: 'Shelf-A4',
            status: 'AVAILABLE',
        },
    ];

    for (const bookData of books) {
        const book = await prisma.book.upsert({
            where: { isbn: bookData.isbn },
            update: {},
            create: bookData,
        });
        console.log('  ✓ Book:', book.title);
    }

    // --- Seed Sample Book Suggestion ---
    const existingSuggestion = await prisma.bookSuggestion.findFirst({
        where: { title: 'The Pragmatic Programmer' },
    });
    if (!existingSuggestion) {
        await prisma.bookSuggestion.create({
            data: {
                title: 'The Pragmatic Programmer',
                author: 'David Thomas, Andrew Hunt',
                description: 'A classic guide to software development best practices.',
                category: 'Software Engineering',
                suggestedById: user.id,
                voteCount: 0,
            },
        });
        console.log('  ✓ Sample book suggestion created');
    }

    // --- Seed Sample Book Donation ---
    const existingDonation = await prisma.bookDonation.findFirst({
        where: { title: 'Structure and Interpretation of Computer Programs' },
    });
    if (!existingDonation) {
        await prisma.bookDonation.create({
            data: {
                userId: user.id,
                title: 'Structure and Interpretation of Computer Programs',
                author: 'Harold Abelson, Gerald Jay Sussman',
                isbn: '978-0-262-51087-5',
                genre: 'Computer Science',
                condition: 'GOOD',
                description: 'Classic MIT textbook on programming fundamentals.',
                status: 'PENDING',
            },
        });
        console.log('  ✓ Sample book donation created');
    }

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
