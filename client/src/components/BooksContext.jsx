import React, { createContext, useState, useEffect } from 'react';
// import { server_url } from "../../config"

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [userProfile, setUserProfile] = useState({ borrowedBooks: [] });
  const [auth_token, setAuth_token] = useState(() =>
    localStorage.getItem("access_token") || null
  );

  const server_url = "https://majestic-folio-lib-app.onrender.com"

  useEffect(() => {
    fetch(`${server_url}/books`, {
      mode: 'cors',
            headers: {
                'Content-Type': 'application/json',}
    }) 
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error(error));
  }, []);

  const borrowBook = (bookId) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId && book.count > 0) {
        return { ...book, count: book.count - 1 };
      }
      return book;
    }));
    setUserProfile(prevProfile => ({
      ...prevProfile,
      borrowedBooks: [...prevProfile.borrowedBooks, bookId]
    }));
  };

  const add_book = (title, author, genre, isbn, available_copies, auth_token) => {
    fetch(`${server_url}/create_book`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            title,
            author,
            genre,
            isbn,
            available_copies
        }),
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        },
    })
    .then((response) => response.json())
    .then((res) => {
        console.log(res);
        if (res.success) {
            toast.success(res.success);
            nav("/librarianprofile");
        } else if (res.error) {
            toast.error(res.error);
        } else {
            toast.error("An error occurred");
        }
    })
    .catch((error) => {
        console.error('Error adding book:', error);
        toast.error("An error occurred while adding book");
    });
};

  const returnBook = (bookId) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId) {
        return {...book, count: book.count + 1 };
      }
      return book;
    }));
    setUserProfile(prevProfile => ({
     ...prevProfile,
      borrowedBooks: prevProfile.borrowedBooks.filter(id => id!== bookId)
    }));
  };

  const deleteBook = (bookId) => {
    fetch(`${server_url}/delete_book/${bookId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.success(res.success);
        nav("/profile");
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("An error occurred");
      }
    })
    .catch((error) => {
      console.error('Error Deleting book:', error);
      toast.error("An error occurred while deleting book");
  });
};

  useEffect(() => {
    if (auth_token) {
      fetch(`${server_url}/current_user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
      })
     .then((response) => response.json())
     .then((data) => {
        setUserProfile(data);
      })
     .catch((error) => {
        console.error('Error fetching current user:', error);
      });
    }
  }, [auth_token]);

  const contextData = {
    books,
    add_book,
    borrowBook,
    returnBook,
    deleteBook,
    userProfile,
    auth_token,
  };


  return (
    <BooksContext.Provider value={contextData}>
      {children}
    </BooksContext.Provider>
  );
};
