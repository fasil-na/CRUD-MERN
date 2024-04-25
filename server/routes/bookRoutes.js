
import express from 'express';
import { createNewBook, getBookData, deleteBook, updateBook,searchBooks } from '../controller/bookController.js';

const bookRouter = express.Router();

bookRouter.post("/", createNewBook);
bookRouter.get("/getBookData", getBookData);
bookRouter.delete("/:id", deleteBook);
bookRouter.put("/:id", updateBook); 
bookRouter.get('/search', searchBooks);
bookRouter.get('/search', searchBooks);

export default bookRouter;












// // Get all books
// router.get('/', async (req, res) => {
//   try {
//     const books = await Book.find();
//     res.send(books);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get a book by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) {
//       return res.status(404).send();
//     }
//     res.send(book);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Update a book by ID
// router.patch('/:id', async (req, res) => {
//   try {
//     const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!book) {
//       return res.status(404).send();
//     }
//     res.send(book);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a book by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) {
//       return res.status(404).send();
//     }
//     res.send(book);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// module.exports = router;
