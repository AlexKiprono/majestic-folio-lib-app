import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch data from backend
    fetch('http://127.0.0.1:5000/bookborrows')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleReturnBook = (bookId) => {
    // Update book return status in backend
    fetch(`http://127.0.0.1:5000/bookborrows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to return book');
        }
        // Update the local state
        setUser(prevState => ({
          ...prevState,
          borrowedBooks: prevState.borrowedBooks.map(book =>
            book.id === bookId ? { ...book, returnedOn: new Date().toISOString().split('T')[0] } : book
          )
        }));
        toast.success('Book returned successfully');
      })
      .catch(error => {
        console.error('Error returning book:', error);
        toast.error('Failed to return book');
      });
  };

  if (!user || !user.borrowedBooks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <ToastContainer />
      <h2 className="text-2xl mb-4">Dashboard</h2>
      {user.borrowedBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <ul>
          {user.borrowedBooks.map((book, index) => (
            <li key={index} className="mb-2 flex justify-between">
              <span className="text-lg">{book.title}</span>
              <span className="text-gray-700">{book.author}</span>
              <span className="text-sm text-gray-500">{book.borrowedOn}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
