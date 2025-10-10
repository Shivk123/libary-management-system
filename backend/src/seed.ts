import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: { 
      name: 'Admin User', 
      email: 'admin@library.com', 
      password: 'admin123',
      role: 'admin'
    } 
  });

  // Create regular users
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'john@example.com' }, update: {}, create: { name: 'John Doe', email: 'john@example.com', password: 'john123' } }),
    prisma.user.upsert({ where: { email: 'jane@example.com' }, update: {}, create: { name: 'Jane Smith', email: 'jane@example.com', password: 'jane123' } }),
    prisma.user.upsert({ where: { email: 'mike@example.com' }, update: {}, create: { name: 'Mike Johnson', email: 'mike@example.com', password: 'mike123' } }),
    prisma.user.upsert({ where: { email: 'sarah@example.com' }, update: {}, create: { name: 'Sarah Wilson', email: 'sarah@example.com', password: 'sarah123' } }),
    prisma.user.upsert({ where: { email: 'tom@example.com' }, update: {}, create: { name: 'Tom Brown', email: 'tom@example.com', password: 'tom123' } }),
    prisma.user.upsert({ where: { email: 'lisa@example.com' }, update: {}, create: { name: 'Lisa Davis', email: 'lisa@example.com', password: 'lisa123' } })
  ]);

  // Create books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        summary: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
        comment: 'A masterpiece of American literature that captures the essence of the 1920s.',
        review: 4.5,
        count: 12,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        price: 500
      }
    }),
    prisma.book.create({
      data: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        summary: 'A gripping tale of racial injustice and childhood innocence in the American South.',
        comment: 'An essential read that addresses important social issues with grace and power.',
        review: 4.8,
        count: 8,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        price: 450
      }
    }),
    prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        summary: 'A dystopian novel about totalitarianism and surveillance in a future society.',
        comment: 'A chilling and prophetic vision of a world under constant surveillance.',
        review: 4.7,
        count: 15,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        price: 400
      }
    }),
    prisma.book.create({
      data: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        summary: 'A romantic novel about manners, upbringing, morality, and marriage in Georgian England.',
        comment: 'Witty and romantic, a timeless story of love overcoming social barriers.',
        review: 4.6,
        count: 10,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
        price: 350
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        summary: 'A coming-of-age story following teenager Holden Caulfield in New York City.',
        comment: 'A controversial yet influential novel about teenage rebellion and alienation.',
        review: 4.2,
        count: 6,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
        price: 300
      }
    }),
    prisma.book.create({
      data: {
        title: 'Lord of the Flies',
        author: 'William Golding',
        summary: 'A group of British boys stranded on an uninhabited island and their disastrous attempt to govern themselves.',
        comment: 'A powerful allegory about human nature and the thin veneer of civilization.',
        review: 4.3,
        count: 9,
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
        price: 380
      }
    })
  ]);

  // Create groups
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Book Club Enthusiasts',
        description: 'A group for passionate readers who love discussing literature',
        createdBy: users[0].id,
        members: {
          create: [
            { userId: users[0].id },
            { userId: users[1].id },
            { userId: users[2].id },
            { userId: users[3].id }
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: 'Study Group - Computer Science',
        description: 'CS students collaborating on technical books and research',
        createdBy: users[1].id,
        members: {
          create: [
            { userId: users[1].id },
            { userId: users[4].id },
            { userId: users[5].id }
          ]
        }
      }
    })
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });