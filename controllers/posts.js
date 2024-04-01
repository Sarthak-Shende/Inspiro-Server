import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
	const { page } = req.query;
	try {
		const LIMIT = 8;
		const startIndex = (Number(page) - 1) * LIMIT;
		const total = await PostMessage.countDocuments();
		const postMessages = await PostMessage.find()
			.sort({ _id: -1 })
			.limit(LIMIT)
			.skip(startIndex);

		res.status(200).json({
			data: postMessages,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;
	try {
		const postMessage = await PostMessage.findOne({ _id: id });
		res.status(200).json(postMessage);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPostsBySearch = async (req, res) => {
	try {
		const { searchQuery, tags } = req.query;
		const search = new RegExp(searchQuery, "i");
		const postMessages = await PostMessage.find().or([
			{ title: search },
			{ tags: { $in: tags.split(",") } },
		]);

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

		res.status(200).json(newPost);
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

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const commentPost = async (req, res) => {
	try {
		const { id } = req.params;
		const { value } = req.body;

		const post = await PostMessage.findOne({ _id: id });
		post.comments.push(value);

		const updatedPost = await PostMessage.findOneAndUpdate({ _id: id }, post, {
			new: true,
		});

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
