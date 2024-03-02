import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/posts", postRoutes);

const CONNECTION_URL =
	"mongodb+srv://sarthakshende757:sarthakshende757@cluster0.kyh1ahn.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
	.connect(CONNECTION_URL)
	.then(() =>
		app.listen(PORT, () => console.log(`Server running on port:${PORT}`))
	)
	.catch((error) => console.log(error.message));
