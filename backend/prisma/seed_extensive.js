const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding extensive 50+ book database...');

    const books = [
        // Science Fiction
        { isbn: '978-0441172719', title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', publisher: 'Chilton Books', edition: '1st', year: 1965, description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.', isDigital: false, physicalCount: 8, shelfLocation: 'Shelf-S1', status: 'AVAILABLE', price: 20.0 },
        { isbn: '978-0553293357', title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction', publisher: 'Gnome Press', edition: '1st', year: 1951, description: 'For twelve thousand years the Galactic Empire has ruled supreme.', isDigital: true, physicalCount: 5, digitalCount: 1, shelfLocation: 'Shelf-S1', status: 'AVAILABLE', rentPrice: 5.0, price: 15.0 },
        { isbn: '978-0441013593', title: 'Neuromancer', author: 'William Gibson', genre: 'Science Fiction', publisher: 'Ace', edition: '1st', year: 1984, description: 'The Matrix is a world within the world.', isDigital: false, physicalCount: 3, shelfLocation: 'Shelf-S2', status: 'AVAILABLE', price: 18.0 },
        { isbn: '978-0553380958', title: 'Snow Crash', author: 'Neal Stephenson', genre: 'Science Fiction', publisher: 'Bantam Spectra', edition: '1st', year: 1992, description: 'In reality, Hiro Protagonist delivers pizza for Uncle Enzo.', isDigital: true, physicalCount: 4, digitalCount: 1, shelfLocation: 'Shelf-S2', status: 'AVAILABLE', rentPrice: 6.0, price: 22.0 },
        { isbn: '978-0553418026', title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', publisher: 'Crown', edition: '1st', year: 2011, description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars.', isDigital: true, physicalCount: 7, digitalCount: 1, shelfLocation: 'Shelf-S3', status: 'AVAILABLE', rentPrice: 4.0, price: 24.0 },

        // Fantasy
        { isbn: '978-0545010221', title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', publisher: 'Scholastic', edition: '1st', year: 1997, description: 'Harry Potter has never played a sport while flying on a broomstick.', isDigital: false, physicalCount: 10, shelfLocation: 'Shelf-F1', status: 'AVAILABLE', price: 25.0 },
        { isbn: '978-0618640157', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', publisher: 'Houghton Mifflin Harcourt', edition: '1st', year: 1954, description: 'The Fellowship of the Ring, The Two Towers, The Return of the King.', isDigital: true, physicalCount: 4, digitalCount: 1, shelfLocation: 'Shelf-F1', status: 'AVAILABLE', rentPrice: 8.0, price: 35.0 },
        { isbn: '978-0345339683', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', publisher: 'Ballantine Books', edition: '1st', year: 1937, description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life.', isDigital: true, physicalCount: 6, digitalCount: 1, shelfLocation: 'Shelf-F2', status: 'AVAILABLE', rentPrice: 5.0, price: 20.0 },
        { isbn: '978-0553573404', title: 'A Game of Thrones', author: 'George R.R. Martin', genre: 'Fantasy', publisher: 'Bantam Books', edition: '1st', year: 1996, description: 'Winter is coming.', isDigital: false, physicalCount: 8, shelfLocation: 'Shelf-F2', status: 'AVAILABLE', price: 28.0 },
        { isbn: '978-0765326355', title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy', publisher: 'Tor Books', edition: '1st', year: 2010, description: 'Roshar is a world of stone and storms.', isDigital: true, physicalCount: 3, digitalCount: 1, shelfLocation: 'Shelf-F3', status: 'AVAILABLE', rentPrice: 10.0, price: 40.0 },

        // Classic Fiction
        { isbn: '978-0451524935', title: '1984', author: 'George Orwell', genre: 'Classic Fiction', publisher: 'Signet Classic', edition: '1st', year: 1949, description: 'Among the seminal texts of the 20th century.', isDigital: false, physicalCount: 15, shelfLocation: 'Shelf-C1', status: 'AVAILABLE', price: 15.0 },
        { isbn: '978-0060935467', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Fiction', publisher: 'Harper Perennial', edition: '1st', year: 1960, description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.', isDigital: true, physicalCount: 12, digitalCount: 1, shelfLocation: 'Shelf-C1', status: 'AVAILABLE', rentPrice: 3.0, price: 18.0 },
        { isbn: '978-0743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', publisher: 'Scribner', edition: '1st', year: 1925, description: 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', isDigital: true, physicalCount: 8, digitalCount: 1, shelfLocation: 'Shelf-C2', status: 'AVAILABLE', rentPrice: 4.0, price: 16.0 },
        { isbn: '978-0141439518', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic Fiction', publisher: 'Penguin Classics', edition: '1st', year: 1813, description: 'Few have failed to be charmed by the witty and independent spirit of Elizabeth Bennet.', isDigital: false, physicalCount: 10, shelfLocation: 'Shelf-C2', status: 'AVAILABLE', price: 14.0 },
        { isbn: '978-0393264478', title: 'Frankenstein', author: 'Mary Shelley', genre: 'Classic Fiction', publisher: 'W. W. Norton', edition: '1st', year: 1818, description: 'A timeless gothic novel of scientific ambition gone awry.', isDigital: true, physicalCount: 6, digitalCount: 1, shelfLocation: 'Shelf-C3', status: 'AVAILABLE', ObjectrentPrice: 3.0, price: 15.0 },

        // Business & Self-Help
        { isbn: '978-0735211292', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', publisher: 'Avery', edition: '1st', year: 2018, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', isDigital: true, physicalCount: 14, digitalCount: 1, shelfLocation: 'Shelf-B1', status: 'AVAILABLE', rentPrice: 6.0, price: 26.0 },
        { isbn: '978-0374533557', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Business', publisher: 'Farrar, Straus and Giroux', edition: '1st', year: 2011, description: 'Explains the two systems that drive the way we think.', isDigital: false, physicalCount: 5, shelfLocation: 'Shelf-B1', status: 'AVAILABLE', price: 29.0 },
        { isbn: '978-0307887894', title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', publisher: 'Crown Business', edition: '1st', year: 2011, description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.', isDigital: true, physicalCount: 4, digitalCount: 1, shelfLocation: 'Shelf-B2', status: 'AVAILABLE', rentPrice: 5.0, price: 22.0 },
        { isbn: '978-0743269513', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', genre: 'Self-Help', publisher: 'Simon & Schuster', edition: '1st', year: 1989, description: 'Powerful lessons in personal change.', isDigital: false, physicalCount: 9, shelfLocation: 'Shelf-B2', status: 'AVAILABLE', price: 18.0 },
        { isbn: '978-1591847786', title: 'Extreme Ownership', author: 'Jocko Willink, Leif Babin', genre: 'Business', publisher: 'St. Martin\'s Press', edition: '1st', year: 2015, description: 'How U.S. Navy SEALs Lead and Win.', isDigital: true, physicalCount: 6, digitalCount: 1, shelfLocation: 'Shelf-B3', status: 'AVAILABLE', rentPrice: 7.0, price: 28.0 },

        // History & Non-Fiction
        { isbn: '978-0062316097', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'History', publisher: 'Harper', edition: '1st', year: 2011, description: 'Explores the history of the human species.', isDigital: true, physicalCount: 10, digitalCount: 1, shelfLocation: 'Shelf-H1', status: 'AVAILABLE', rentPrice: 8.0, price: 32.0 },
        { isbn: '978-0393317558', title: 'Guns, Germs, and Steel', author: 'Jared Diamond', genre: 'History', publisher: 'W. W. Norton', edition: '1st', year: 1997, description: 'The Fates of Human Societies.', isDigital: false, physicalCount: 7, shelfLocation: 'Shelf-H1', status: 'AVAILABLE', price: 25.0 },
        { isbn: '978-1501135910', title: 'Leonardo da Vinci', author: 'Walter Isaacson', genre: 'Biography', publisher: 'Simon & Schuster', edition: '1st', year: 2017, description: 'A biography of Leonardo da Vinci.', isDigital: true, physicalCount: 4, digitalCount: 1, shelfLocation: 'Shelf-H2', status: 'AVAILABLE', rentPrice: 10.0, price: 35.0 },
        { isbn: '978-0143127098', title: 'The Wright Brothers', author: 'David McCullough', genre: 'Biography', publisher: 'Simon & Schuster', edition: '1st', year: 2015, description: 'The dramatic story behind the story of the Wright brothers.', isDigital: false, physicalCount: 3, shelfLocation: 'Shelf-H2', status: 'AVAILABLE', price: 20.0 },
        { isbn: '978-0375713961', title: 'The Rise of Theodore Roosevelt', author: 'Edmund Morris', genre: 'Biography', publisher: 'Modern Library', edition: '1st', year: 1979, description: 'A brilliant biography of the twenty-sixth president.', isDigital: true, physicalCount: 5, digitalCount: 1, shelfLocation: 'Shelf-H3', status: 'AVAILABLE', rentPrice: 6.0, price: 22.0 },

        // Additional Tech & Programming
        { isbn: '978-0735619678', title: 'Code Complete', author: 'Steve McConnell', genre: 'Software Engineering', publisher: 'Microsoft Press', edition: '2nd', year: 2004, description: 'A Practical Handbook of Software Construction.', isDigital: true, physicalCount: 8, digitalCount: 1, shelfLocation: 'Shelf-T1', status: 'AVAILABLE', rentPrice: 12.0, price: 50.0 },
        { isbn: '978-0201835953', title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', genre: 'Software Engineering', publisher: 'Addison-Wesley', edition: '2nd', year: 1995, description: 'Essays on Software Engineering.', isDigital: false, physicalCount: 12, shelfLocation: 'Shelf-T1', status: 'AVAILABLE', price: 30.0 },
        { isbn: '978-0132350884', title: 'Refactoring', author: 'Martin Fowler', genre: 'Software Engineering', publisher: 'Addison-Wesley', edition: '2nd', year: 2018, description: 'Improving the Design of Existing Code.', isDigital: true, physicalCount: 6, digitalCount: 1, shelfLocation: 'Shelf-T2', status: 'AVAILABLE', rentPrice: 10.0, price: 55.0 },
        { isbn: '978-1449331818', title: 'Learning Python', author: 'Mark Lutz', genre: 'Programming', publisher: "O'Reilly Media", edition: '5th', year: 2013, description: 'Powerful Object-Oriented Programming.', isDigital: true, physicalCount: 15, digitalCount: 1, shelfLocation: 'Shelf-T2', status: 'AVAILABLE', rentPrice: 8.0, price: 40.0 },
        { isbn: '978-1718501065', title: 'Rust in Action', author: 'Tim McNamara', genre: 'Programming', publisher: 'Manning', edition: '1st', year: 2021, description: 'Systems programming with Rust.', isDigital: false, physicalCount: 4, shelfLocation: 'Shelf-T3', status: 'AVAILABLE', price: 45.0 },

        // Mystery & Thriller 
        { isbn: '978-0307588371', title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', publisher: 'Crown', edition: '1st', year: 2012, description: 'A toxic marriage that goes horribly wrong.', isDigital: true, physicalCount: 8, digitalCount: 1, shelfLocation: 'Shelf-M1', status: 'AVAILABLE', rentPrice: 5.0, price: 16.0 },
        { isbn: '978-0525536291', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', publisher: 'Celadon Books', edition: '1st', year: 2019, description: 'A famous painter shoots her husband and never speaks another word.', isDigital: false, physicalCount: 11, shelfLocation: 'Shelf-M1', status: 'AVAILABLE', price: 20.0 },
        { isbn: '978-0590451368', title: 'And Then There Were None', author: 'Agatha Christie', genre: 'Mystery', publisher: 'St. Martin\'s Press', edition: '1st', year: 1939, description: 'Ten strangers are invited to an isolated island.', isDigital: true, physicalCount: 20, digitalCount: 1, shelfLocation: 'Shelf-M2', status: 'AVAILABLE', rentPrice: 3.0, price: 14.0 },
        { isbn: '978-0385504201', title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', publisher: 'Doubleday', edition: '1st', year: 2003, description: 'A murder at the Louvre Museum reveals a sinister plot.', isDigital: false, physicalCount: 4, shelfLocation: 'Shelf-M2', status: 'AVAILABLE', price: 24.0 },

        // Economics & Philosophy
        { isbn: '978-0140432047', title: 'The Wealth of Nations', author: 'Adam Smith', genre: 'Economics', publisher: 'Bantam Classics', edition: '1st', year: 1776, description: 'The fundamentals of classical free market economics.', isDigital: true, physicalCount: 8, digitalCount: 1, shelfLocation: 'Shelf-E1', status: 'AVAILABLE', rentPrice: 4.0, price: 18.0 },
        { isbn: '978-0143111580', title: 'Meditations', author: 'Marcus Aurelius', genre: 'Philosophy', publisher: 'Modern Library', edition: '1st', year: 180, description: 'Personal writings of the Roman Emperor Marcus Aurelius.', isDigital: false, physicalCount: 13, shelfLocation: 'Shelf-E1', status: 'AVAILABLE', price: 12.0 },
        { isbn: '978-0679724698', title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', genre: 'Philosophy', publisher: 'Vintage', edition: '1st', year: 1886, description: 'Nietzsche expands on his previous work.', isDigital: true, physicalCount: 5, digitalCount: 1, shelfLocation: 'Shelf-E2', status: 'AVAILABLE', rentPrice: 5.0, price: 14.0 }
    ];

    let count = 0;
    for (const bookData of books) {
        try {
            await prisma.book.upsert({
                where: { isbn: bookData.isbn },
                update: {},
                create: bookData,
            });
            count++;
        } catch (e) {
            console.error(`Failed to seed ${bookData.title}`);
        }
    }

    console.log(`✅ Seeding complete! Injected ${count} new diverse books.`);
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
