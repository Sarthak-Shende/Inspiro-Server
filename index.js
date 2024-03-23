import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/posts", postRoutes);
app.use("/user",usersRoutes);

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.CONNECTION_URL)
	.then(() =>
		app.listen(PORT, () => console.log(`Server running on port:${PORT}`))
	)
	.catch((error) => console.log(error.message));
