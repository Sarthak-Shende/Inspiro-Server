import mongoose from "mongoose";

const postSchema = mongoose.Schema({
	title: String,
	message: String,
	name: String,
	creator: String,
	tags: [String],
	selectedFile: String, // here we save image converted into srting using base64
	likes: { type: [String], default: [] },
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
