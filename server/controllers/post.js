
import Post from "../models/Post.js";
import User from "../models/User.js";


// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description, isPicture } = req.body;
        const user = await User.findById(userId);

        const newPost = await new Post({
            userId,
            userName: user.userName,
            description,
            isPicture,
            isUserPicture: user.isPicture,
            likes: {},
            comments: []
        });
        const { _id } = await newPost.save();
        const post = await Post.find().sort({ 'updatedAt': -1, 'createdAt': - 1 }).lean();

        res.status(200).json({ currPostId: _id, post });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const createComment = async (req, res) => {
    try {
        const { userId, postId, comment } = req.body;
        const user = await User.findById(userId);
        let posts = await Post.findById(postId);

        posts.comments.push({
            userId: userId,
            userName: user.userName,
            isUserPicture: user.isPicture,
            comment: comment
        });
        await posts.save();
        res.status(200).json(posts);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ 'updatedAt': -1, 'comments.updatedAt': -1 }).lean();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ 'updatedAt': -1, 'comments.updatedAt': -1 }).lean();
        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const sharePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// UPDATE
export const AddRemoveLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found." });

        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const postUpdate = async (req, res) => {
    try {
        const { postId, desc } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(400);

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                description: desc
            },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const commentUpdate = async (req, res) => {
    try {
        const { userId, postId, cmtId, comment } = req.body;
        const user = await User.findById(userId);
        let post = await Post.findById(postId);

        await Post.updateOne(
            {
                "comments._id": cmtId
            },
            {
                "$set": {
                    "comments.$": {
                        userId: userId,
                        isUserPicture: user.isPicture,
                        userName: user.userName,
                        comment: comment
                    },
                }
            },
            { "new": true }
        );
        post = await Post.findById(postId);

        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// REMOVE
export const removePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const currPost = await Post.findById(postId);

        if (!currPost) return res.status(400).json({ message: "Does't found any post." });

        await Post.findByIdAndDelete(postId);
        const post = await Post.find().sort({ 'updatedAt': -1, 'createdAt': - 1 }).lean();
        await User.updateMany(
            { "savePosts": postId },
            {
                $pull: {
                    "savePosts": postId
                }
            }
        )

        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const removeComment = async (req, res) => {
    try {

        const { cmtId } = req.params;
        const { userId, postId } = req.body;

        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (!user && !post) return res.status(400).json({ message: "Requested data does not exists." });

        const updatedPostComment = await Post.updateOne({
            "_id": postId
        }, {
            $pull: {
                "comments": { _id: cmtId }
            }
        },
            { new: true }
        );
        const updatedPost = await Post.findById(postId);
        if (updatedPostComment) return res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}