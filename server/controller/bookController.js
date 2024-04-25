import Book from "../models/bookModel.js";

export const createNewBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);

    await book.save();
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getBookData = async (req, res, next) => {
  const { page, pageSize } = req.query;
  const pageNumber = parseInt(page) || 1;
  const size = parseInt(pageSize) || 10;
  const skip = (pageNumber - 1) * size;

  try {
    const books = await Book.find().skip(skip).limit(size);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / size);

    res.json({ books, totalPages });
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { name, description, publishDate, price } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { name, description, publishDate, price },
      { new: true }
    );

    if (updatedBook) {
      return res.status(200).json(updatedBook);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    const filteredBooks = await Book.find({
      $or: [
        { name: { $regex: new RegExp(query), $options: "i" } },
        { description: { $regex: new RegExp(query), $options: "i" } },
      ],
    });
    res.json(filteredBooks);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
