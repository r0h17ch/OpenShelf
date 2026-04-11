const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting realistic data insertion...');

  // 1. Fetch Users
  const user = await prisma.user.findUnique({ where: { email: 'ayan@iiitk.ac.in' } });
  const admin = await prisma.user.findUnique({ where: { email: 'admin@openshelf.dev' } });

  if (!user || !admin) {
    console.error('❌ Default users not found! Run base seed first.');
    return;
  }

  // 2. Add Indian Books
  const booksToInsert = [
    {
      isbn: '9780143415086',
      title: 'The Guide',
      author: 'R. K. Narayan',
      genre: 'Fiction',
      publisher: 'Penguin India',
      year: 1958,
      description: 'A novel based in Malgudi, capturing the transformation of Raju from a tour guide to a spiritual leader.',
      physicalCount: 5,
      status: 'AVAILABLE',
      coverUrl: 'https://m.media-amazon.com/images/I/71u9s9m2V5L._AC_UF1000,1000_QL80_.jpg'
    },
    {
      isbn: '9788172234980',
      title: 'The God of Small Things',
      author: 'Arundhati Roy',
      genre: 'Literary Fiction',
      publisher: 'IndiaInk',
      year: 1997,
      description: 'The story of fraternal twins whose lives are destroyed by the "Love Laws" that lay down who should be loved, and how.',
      physicalCount: 3,
      status: 'AVAILABLE',
      coverUrl: 'https://m.media-amazon.com/images/I/910HlO9XUeL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      isbn: '9788173711466',
      title: 'Wings of Fire',
      author: 'A. P. J. Abdul Kalam',
      genre: 'Autobiography',
      publisher: 'Universities Press',
      year: 1999,
      description: 'An autobiography of A P J Abdul Kalam, former President of India, detailing his early life and career in aerospace.',
      physicalCount: 8,
      status: 'AVAILABLE',
      coverUrl: 'https://m.media-amazon.com/images/I/71KKZlVjbwL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      isbn: '9780099581084',
      title: 'Midnight\'s Children',
      author: 'Salman Rushdie',
      genre: 'Magical Realism',
      publisher: 'Vintage',
      year: 1981,
      description: 'A novel dealing with India\'s transition from British colonialism to independence and the partition of India.',
      physicalCount: 2,
      status: 'AVAILABLE',
      coverUrl: 'https://m.media-amazon.com/images/I/81I233W8GqL._AC_UF1000,1000_QL80_.jpg'
    }
  ];

  const books = [];
  for (const b of booksToInsert) {
    const existing = await prisma.book.findUnique({ where: { isbn: b.isbn } });
    if (!existing) {
      books.push(await prisma.book.create({ data: b }));
      console.log(`✅ Added book: ${b.title}`);
    } else {
      books.push(existing);
    }
  }

  // Pick books for interactions
  const b1 = books[0]; // The Guide
  const b2 = books[1]; // God of Small Things
  const b3 = books[2]; // Wings of Fire
  const b4 = books[3]; // Midnight's Children

  // 3. User Circulation (Borrowed Books)
  // Check if they already borrowed
  let circ = await prisma.circulation.findFirst({ where: { userId: user.id, bookId: b1.id } });
  if (!circ) {
    circ = await prisma.circulation.create({
      data: {
        userId: user.id,
        bookId: b1.id,
        type: 'BORROW',
        borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),     // Due in 5 days
      }
    });
    console.log('✅ Created active borrowing record for Ayan.');
  }

  // 4. Overdue Borrowing & Fines
  let overdueCirc = await prisma.circulation.findFirst({ where: { userId: user.id, bookId: b2.id } });
  if (!overdueCirc) {
    overdueCirc = await prisma.circulation.create({
      data: {
        userId: user.id,
        bookId: b2.id,
        type: 'BORROW',
        borrowDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),     // Overdue by 5 days
      }
    });
    // Create fine for this
    await prisma.fine.create({
      data: {
        circulationId: overdueCirc.id,
        amount: 50.0, // 50 units fine
        isPaid: false
      }
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { fineBalance: user.fineBalance + 50.0 }
    });
    console.log('✅ Created overdue circulation and fine for Ayan.');
  }

  // 5. Reservations
  const existingRes = await prisma.reservation.findFirst({ where: { userId: user.id, bookId: b3.id } });
  if (!existingRes) {
    await prisma.reservation.create({
      data: {
        userId: user.id,
        bookId: b3.id,
        status: 'PENDING',
        position: 1
      }
    });
    console.log('✅ Created reservation for Ayan.');
  }

  // 6. Transactions
  const existingTx = await prisma.transaction.findFirst({ where: { userId: user.id, type: 'BOOK_PURCHASE' } });
  if (!existingTx) {
    await prisma.transaction.create({
      data: {
        type: 'BOOK_PURCHASE',
        userId: user.id,
        bookId: b4.id,
        amount: 250.0,
        paymentMethod: 'ONLINE',
        paymentStatus: 'COMPLETED',
        description: `Purchased digital copy of ${b4.title}`
      }
    });
    console.log('✅ Created a purchase transaction for Ayan.');
  }

  // 7. Donations
  const existingDonation = await prisma.bookDonation.findFirst({ where: { userId: user.id, title: 'Discovery of India' } });
  if (!existingDonation) {
    await prisma.bookDonation.create({
      data: {
        userId: user.id,
        title: 'Discovery of India',
        author: 'Jawaharlal Nehru',
        isbn: '9780143031031',
        publicationYear: 1946,
        genre: 'History',
        condition: 'GOOD',
        description: 'A classic historical book I want to donate to the library.',
        status: 'PENDING'
      }
    });
    console.log('✅ Created book donation record for Ayan.');
  }

  // 8. Suggestions
  const existingSuggestion = await prisma.bookSuggestion.findFirst({ where: { suggestedById: user.id } });
  if (!existingSuggestion) {
    await prisma.bookSuggestion.create({
      data: {
        title: 'Train to Pakistan',
        author: 'Khushwant Singh',
        description: 'Iconic historical novel regarding the partition. Essential for the library.',
        category: 'Historical Fiction',
        suggestedById: user.id,
        status: 'PENDING',
        voteCount: 12
      }
    });
    console.log('✅ Created book suggestion for Ayan.');
  }

  // 9. Reviews
  const existingReview = await prisma.review.findFirst({ where: { userId: user.id, bookId: b1.id } });
  if (!existingReview) {
    await prisma.review.create({
      data: {
        bookId: b1.id,
        userId: user.id,
        rating: 5,
        comment: 'Absolutely brilliant novel by R.K. Narayan. A must-read!'
      }
    });
    await prisma.review.create({
      data: {
        bookId: b3.id,
        userId: admin.id,
        rating: 5,
        comment: 'Very inspiring autobiography of Dr. Kalam. Highly recommended for students.'
      }
    });
    console.log('✅ Created realistic reviews.');
  }

  console.log('🎉 Realistic data insertion completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
