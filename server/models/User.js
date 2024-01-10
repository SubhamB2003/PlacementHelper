import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    isPicture: {
        type: Boolean,
        default: false
    },
    profession: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        min: 9
    },
    location: {
        type: String,
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    instagramId: {
        type: String,
    },
    linkedinId: {
        type: String,
    },
    githubId: {
        type: String,
    },
    savePosts: {
        type: Array,
        default: []
    }
}, { timestamps: true });


const User = mongoose.model("Users", userSchema);
export default User;