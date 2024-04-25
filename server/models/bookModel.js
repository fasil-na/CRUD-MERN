import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
