from app import app, db
from models import User, Book, BookBorrow, Category, CategoryBook
from faker import Faker
import random
from datetime import datetime, timedelta

faker = Faker()

# Realistic names and titles data
real_names = [
    'John Smith', 'Jane Doe', 'Michael Johnson', 'Emily Williams', 'Robert Brown',
    'Sophia Jones', 'William Davis', 'Olivia Martinez', 'David Garcia', 'Isabella Rodriguez',
    'James Wilson', 'Charlotte Lopez', 'Joseph Martinez', 'Amelia Gonzalez', 'Daniel Miller',
    'Mia Davis', 'Alexander Moore', 'Evelyn Anderson', 'Matthew Thomas', 'Abigail Martin'
]

real_titles = [
    'To Kill a Mockingbird', 'Sapiens: A Brief History of Humankind', 'The Great Gatsby',
    '1984', 'Pride and Prejudice', 'The Catcher in the Rye', 'The Hobbit', 'Brave New World',
    'The Lord of the Rings', 'Harry Potter and the Philosopher\'s Stone', 'The Da Vinci Code',
    'Gone with the Wind', 'The Alchemist', 'Crime and Punishment', 'The Road', 'Moby-Dick',
    'The Grapes of Wrath', 'One Hundred Years of Solitude', 'The Shining', 'Wuthering Heights'
]

def seed_users():
    for name in real_names:
        username = faker.user_name()
        email = faker.email()
        is_admin = faker.boolean(chance_of_getting_true=10)  # 10% chance to be admin

        user = User(
            username=username,
            email=email,
            is_admin=is_admin
        )
        user.set_password('password123')
        db.session.add(user)

    db.session.commit()

def seed_books():
    genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-help', 'Programming']
    
    for title in real_titles:
        author = faker.name()
        genre = random.choice(genres)
        isbn = faker.isbn13()
        available_copies = random.randint(1, 10)

        book = Book(
            title=title,
            author=author,
            genre=genre,
            isbn=isbn,
            available_copies=available_copies
        )
        db.session.add(book)

    db.session.commit()

def seed_borrows():
    users = User.query.all()
    books = Book.query.all()

    for _ in range(50):
        user = random.choice(users)
        book = random.choice(books)

        borrow = BookBorrow(
            user_id=user.id,
            book_id=book.id,
            borrow_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            return_date=None
        )
        db.session.add(borrow)

    db.session.commit()

def seed_categories():
    categories_data = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-help', 'Programming']

    for category_name in categories_data:
        category = Category(name=category_name)
        db.session.add(category)

    db.session.commit()

def seed_category_book_associations():
    books = Book.query.all()
    categories = Category.query.all()

    for book in books:
        num_categories = random.randint(1, 3)
        chosen_categories = random.sample(categories, num_categories)

        for category in chosen_categories:
            category_book = CategoryBook(category_id=category.id, book_id=book.id)
            db.session.add(category_book)

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        seed_users()
        seed_books()
        seed_borrows()
        seed_categories()
        seed_category_book_associations()
        print('Database seeding completed.')
