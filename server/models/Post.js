import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    isUserPicture: Boolean,
    comment: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: new Date
    }
});

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    isPicture: {
        type: Boolean,
        default: false
    },
    isUserPicture: Boolean,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: [commentSchema],
}, { timestamps: true });





const Post = mongoose.model("Posts", postSchema);
export default Post;










