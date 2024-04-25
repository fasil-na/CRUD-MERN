import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bookRouter from "./routes/bookRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/", bookRouter);

const PORT = process.env.PORT || 4000;

mongoose
  .connect("mongodb://localhost:27017/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
