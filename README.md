# Majestic-Folio-Library Management System
## By Alex Kiprono , Shisia Whitney , Henry Bogita .
Welcome to the Majestic-Folio-Library Management System! This application is designed to help manage a library's books and users. It includes features such as book borrowing, returning, user authentication, and more.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [License](#license)

## Features

### Admin Management
- Create, read, and delete books
- Update book availability and record borrowing details
- Return books and update availability

### User Management
- User authentication and authorization (login/logout)
- Read book details and borrow books
- View user profile, borrowing history, and reserved books

### Search and Filter
- Search functionality by title, author, genre, etc.
- Filter books by availability

### Navigation
- Navigate between different sections of the app (e.g., catalog, user profile)
- Display list of books with details (title, author, availability)
- Confirmation dialogs and feedback on successful operations

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Majestic-Folio-Library.git
   cd Majestic-Folio-Library

2. Create a virtual environment and activate it:
   python3 -m venv venv
   source venv/bin/activate  # On Windows use venv\Scripts\activate

3. Install the dependencies:
   pip install -r requirements.txt

4. Initialize the database:
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade

### Frotend Setup
1. Navigate to the client directory:
   cd client
2. Install the dependencies:
     npm install --prefix client
3. Run the React development server:
       npm start --prefix client

API Endpoints
Here are some key API endpoints:

User Authentication:
POST /register - Register a new user
POST /login - Login and receive an access token

Book Management:
GET /books - Retrieve all books
POST /books - Add a new book (Admin only)
GET /books/:id - Retrieve details of a specific book
DELETE /books/:id - Delete a book (Admin only)

Borrowing:
POST /borrow/:book_id - Borrow a book
POST /return/:book_id - Return a borrowed book

Support and contact details

- email :: shisiawhitney215@gmail.com
- phone :: +254705719325

-email  :: lexiekiprono@gmail.com
-phone  :: +254740489464

-email ::  bogitahenry02@gmail.com
-phone :: +254702375160

License
This project is licensed under the MIT License. See the LICENSE file for details.


 
