import React, { useContext, useState } from 'react';
import { BooksContext } from '../components/BooksContext';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import { faker } from '@faker-js/faker'; // Assuming this is correctly imported
import { UserContext } from '../components/UserContext';
import { Link } from 'react-router-dom';
import EditBookForm from './EditBookForm';
function BookList() {
  const { books, borrowBook } = useContext(BooksContext);
  const { currentUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('title');
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const handleBorrow = (bookId) => {
    borrowBook(bookId)
      .then(() => {
        const borrowedBook = books.find((book) => book.id === bookId);
        setBorrowedBooks((prevBorrowedBooks) => [...prevBorrowedBooks, borrowedBook]);
        toast.success('Book borrowed successfully');
      })
      .catch((error) => {
        toast.error(`Failed to borrow book: ${error.message}`);
      });
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId)
        .then(() => {
          toast.success('Book deleted successfully');
          // Optionally, update the local state of books or refetch the book list
        })
        .catch((error) => {
          toast.error(`Failed to delete book: ${error.message}`);
        });
    }
  };

  const addToDashboard = (book) => {
    setBorrowedBooks((prevBorrowedBooks) => [...prevBorrowedBooks, book]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // You can add search functionality here if needed
  };

  const filteredBooks = books.filter((book) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (filter === 'title') {
      return book.title.toLowerCase().includes(lowerCaseQuery);
    } else if (filter === 'author') {
      return book.author.toLowerCase().includes(lowerCaseQuery);
    } else if (filter === 'category') {
      return book.category.toLowerCase().includes(lowerCaseQuery);
    }
    return true;
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center my-6">Library Book List</h1>
        <Toaster />
        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <div className="flex flex-col md:flex-row">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-l-lg py-2 px-4 bg-white focus:outline-none"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="category">Category</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${filter}`}
              className="border border-gray-300 py-2 px-4 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg py-2 px-4 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
        <div className="book-list grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 m-5 p-5">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-item flex flex-col bg-white rounded-lg shadow-lg">
              <img
                src={faker.image.url(150, 200, 'books', true)}
                alt={book.title}
                className="w-100 h-60 mb-4 rounded"
              />
              <div className="book-info text-center">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-700">Author: {book.author}</p>
                <p className="text-gray-700">Category: {book.category}</p>
                <p className="text-gray-700">Number of books: {book.available_copies}</p>
                <p className={`text-${book.available_copies > 0 ? 'green' : 'red'}-500`}>
                  Availability: {book.available_copies > 0 ? 'Available' : 'Unavailable'}
                </p>

                {/* Conditional rendering for buttons based on admin status */}
                {currentUser.is_admin ? (
                  <div className="mt-4 space-x-2">
                    <Link to={`/edit/${book.id}`} data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Edit
                    </Link>
                    
                    {/* <EditBookForm/> */}

                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={book.available_copies === 0}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
        <Dashboard borrowedBooks={borrowedBooks} addToDashboard={addToDashboard} />
      </div>
      <Footer />
    </div>
  );
}

export default BookList;
