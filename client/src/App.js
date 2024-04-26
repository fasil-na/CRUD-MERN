import "./App.css";
import React, { useState, useEffect } from "react";
import bookAxios from "../src/Axios/BookAxios.js";
import Swal from "sweetalert2";

function App() {
  const [visible, setVisible] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    publishDate: "",
    price: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await bookAxios.get("/getBookData", {
          params: {
            page: currentPage,
            pageSize: 2, 
          },
        });
        setBookDetails(response.data.books);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    fetchBookData();
  }, [currentPage, bookDetails]);

  const togglePopup = () => {
    setVisible(!visible);
  };

  const closePopup = () => {
    setVisible(false);
    clearForm(); 
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      publishDate: "",
      price: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (formData.price < 1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Price should be greater than 1!",
      });
      return;
    }

    const today = new Date();
    const publishDate = new Date(formData.publishDate);
    if (publishDate > today) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Publish date cannot be in the future.",
      });
      return;
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.publishDate ||
      !formData.price
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the fields!",
      });
      return;
    }
    try {
      let response;
      if (formData._id) {
        response = await bookAxios.put(`/${formData._id}`, formData);
      } else {
        response = await bookAxios.post("/", formData);
      }

      if (response.status === 201 || response.status === 200) {
        console.log("Book operation successful:", response.data);
        setFormData({
          name: "",
          description: "",
          publishDate: "",
          price: "",
        });

        togglePopup();
      } else {
        console.error("Failed to perform book operation:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const response = await bookAxios.delete(`/${bookId}`);

      if (response.status === 200) {
        console.log("Book deleted successfully");
      } else {
        console.error("Failed to delete book:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (bookId) => {
    const bookToEdit = bookDetails.find((book) => book._id === bookId);
    setFormData({
      ...bookToEdit,
      publishDate: new Date(bookToEdit.publishDate).toISOString().split("T")[0],
    });
    setVisible(true);
  };

  const handleSearchClick = async () => {
    try {
      const response = await bookAxios.get("/search", {
        params: {
          query: searchQuery,
        },
      });

      setSearchResults(response.data);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const displayBooks = searchPerformed ? searchResults : bookDetails;

  return (
    <div className="App">
      <div className="header">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            Search
          </button>
        </div>
        <button className="add-book-button" onClick={togglePopup}>
          Add Book
        </button>
      </div>

      {visible && (
        <div className="popup">
          <div className="popup-content">
            <span className="popup-close" onClick={closePopup}>
              X
            </span>
            <h3>{formData._id ? "Edit Book" : "Add Book"}</h3>
            <input
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              placeholder="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              placeholder="Publish Date"
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
            />
            <input
              placeholder="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>
              {formData._id ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}

      <div className="book-cards">
        {displayBooks.length > 0 ? (
          displayBooks.map((book, index) => (
            <div key={index} className="book-card">
              <h2>{book.name}</h2>
              <p>Description: {book.description}</p>
              <p>
                Publish Date:{" "}
                {new Date(book.publishDate).toISOString().split("T")[0]}
              </p>
              <p>Price: {book.price} Rs.</p>
              <button
                className="button delete-button"
                onClick={() => handleDelete(book._id)}
              >
                Delete
              </button>
              <button
                className="button edit-button"
                onClick={() => handleEdit(book._id)}
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">
            {searchPerformed
              ? "No search results found."
              : "No books were added."}
          </p>
        )}
      </div>

      <div className="pagination">
        <button
          className={currentPage === 1 ? "disabled" : ""}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={currentPage === totalPages ? "disabled" : ""}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
