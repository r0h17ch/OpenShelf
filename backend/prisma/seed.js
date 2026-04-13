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
        ...[
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
        }
        ],
        // New Educational Tech/Engineering entries added below:
        {
            isbn: '978-1-449-37332-0',
            title: 'Designing Data-Intensive Applications',
            author: 'Martin Kleppmann',
            genre: 'Software Engineering',
            publisher: "O'Reilly Media",
            edition: '1st',
            year: 2017,
            description: 'The big ideas behind reliable, scalable, and maintainable systems.',
            isDigital: true,
            physicalCount: 7,
            digitalCount: 1,
            shelfLocation: 'Shelf-D1',
            status: 'AVAILABLE',
            rentPrice: 15.0,
            price: 60.0,
        },
        {
            isbn: '978-0-13-110362-7',
            title: 'The C Programming Language',
            author: 'Brian W. Kernighan, Dennis M. Ritchie',
            genre: 'Computer Science',
            publisher: 'Prentice Hall',
            edition: '2nd',
            year: 1988,
            description: 'The classic book on the C programming language.',
            isDigital: false,
            physicalCount: 10,
            shelfLocation: 'Shelf-D2',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-0-201-61622-4',
            title: 'The Pragmatic Programmer',
            author: 'Andrew Hunt, David Thomas',
            genre: 'Software Engineering',
            publisher: 'Addison-Wesley',
            edition: '20th Anniversary',
            year: 2019,
            description: 'Your journey to mastery in software development.',
            isDigital: true,
            physicalCount: 5,
            digitalCount: 1,
            shelfLocation: 'Shelf-D3',
            status: 'AVAILABLE',
            rentPrice: 8.0,
            price: 45.0,
        },
        {
            isbn: '978-0-13-359414-0',
            title: 'Artificial Intelligence: A Modern Approach',
            author: 'Stuart Russell, Peter Norvig',
            genre: 'Computer Science',
            publisher: 'Pearson',
            edition: '4th',
            year: 2020,
            description: 'Comprehensive introduction to the theory and practice of artificial intelligence.',
            isDigital: false,
            physicalCount: 2,
            shelfLocation: 'Shelf-E1',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-0-9847828-5-7',
            title: 'Cracking the Coding Interview',
            author: 'Gayle Laakmann McDowell',
            genre: 'Education',
            publisher: 'CareerCup',
            edition: '6th',
            year: 2015,
            description: '189 programming questions and solutions.',
            isDigital: false,
            physicalCount: 15,
            shelfLocation: 'Shelf-E2',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-1-119-05655-3',
            title: 'Computer Networking: A Top-Down Approach',
            author: 'James F. Kurose, Keith W. Ross',
            genre: 'Computer Science',
            publisher: 'Pearson',
            edition: '8th',
            year: 2021,
            description: 'A top-down approach focusing on the Internet and fundamental networking concepts.',
            isDigital: true,
            physicalCount: 6,
            digitalCount: 1,
            shelfLocation: 'Shelf-E3',
            status: 'AVAILABLE',
            rentPrice: 12.0,
            price: 80.0,
        },
        {
            isbn: '978-0-262-53305-8',
            title: 'Deep Learning',
            author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
            genre: 'Computer Science',
            publisher: 'MIT Press',
            edition: '1st',
            year: 2016,
            description: 'Presents a broad range of topics in deep learning.',
            isDigital: false,
            physicalCount: 3,
            shelfLocation: 'Shelf-F1',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-0-13-449416-6',
            title: 'Clean Architecture',
            author: 'Robert C. Martin',
            genre: 'Software Engineering',
            publisher: 'Prentice Hall',
            edition: '1st',
            year: 2017,
            description: 'A Craftsman\'s Guide to Software Structure and Design.',
            isDigital: true,
            physicalCount: 4,
            digitalCount: 1,
            shelfLocation: 'Shelf-F2',
            status: 'AVAILABLE',
            rentPrice: 10.0,
            price: 55.0,
        },
        {
            isbn: '978-0-321-48681-3',
            title: 'Compilers: Principles, Techniques, and Tools',
            author: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman',
            genre: 'Computer Science',
            publisher: 'Pearson',
            edition: '2nd',
            year: 2006,
            description: 'Also known as the Dragon Book, covering compiler theory and implementation.',
            isDigital: false,
            physicalCount: 2,
            shelfLocation: 'Shelf-F3',
            status: 'AVAILABLE',
        },
        {
            isbn: '978-1-118-06333-0',
            title: 'The Art of Electronics',
            author: 'Paul Horowitz, Winfield Hill',
            genre: 'Electronics Engineering',
            publisher: 'Cambridge University Press',
            edition: '3rd',
            year: 2015,
            description: 'The authoritative text and reference on electronic circuit design.',
            isDigital: false,
            physicalCount: 3,
            shelfLocation: 'Shelf-G1',
            status: 'AVAILABLE',
        }
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
