import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
	try {
		const postMessages = await PostMessage.find();

		res.status(200).json(postMessages);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPostsBySearch = async (
	{ query: { searchQuery, tags } },
	res
) => {
	try {
		const title = new RegExp(searchQuery, "i");
		const postMessages = await PostMessage.find({
			$or: [{ title }, { tags: { $in: tags.split(",") } }],
		});

		res.status(200).json(postMessages);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;
	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	});

	try {
		await newPost.save();

		res.json(newPost);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	try {
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).send("No post with that id");

		const updatedPost = await PostMessage.findOneAndUpdate(
			{ _id: id },
			{ ...body, _id: id },
			{
				new: true,
			}
		);
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const deletePost = async ({ params: { id } }, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).send("No post with that id");

		await PostMessage.findOneAndDelete({ _id: id });
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const likePost = async ({ params: { id }, userId }, res) => {
	try {
		if (!userId) return res.json({ message: "Unauthenticated." });

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).send("No post with that id");

		const post = await PostMessage.findOne({ _id: id });

		const index = post.likes.findIndex((id) => id === String(userId));

		if (index === -1) {
			post.likes.push(userId);
		} else {
			post.likes = post.likes.filter((id) => id !== String(userId));
		}

		const updatedPost = await PostMessage.findOneAndUpdate({ _id: id }, post, {
			new: true,
		});
		//console.log(updatedPost);
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
