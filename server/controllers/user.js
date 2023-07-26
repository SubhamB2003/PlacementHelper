import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import Post from "../models/Post.js";
import User from "../models/User.js";


// READ (PROFILE, SEARCH BAR)
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email: email });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4m' });
        res.status(200).json(token);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await User.find();

        const formattedSavePosts = user.map(
            ({ _id, userName, profession, picturePath }) => {
                return { _id, userName, profession, picturePath };
            }
        );
        res.status(200).json(formattedSavePosts);

    } catch (err) {
        res.status(400).json({ "message": err.message });
    }
}


// UPDATE
export const AddRemoveSavedPost = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const user = await User.findById(userId);
        const post = await User.findById(postId);


        if (user.savePosts.includes(postId)) {
            user.savePosts = user.savePosts.filter((id) => id !== postId);
        }
        else {
            user.savePosts.push(postId);
        }

        const savePost = await user.save();
        res.status(200).json(savePost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, location, profession, gender, picturePath, about, graduateYear, phoneNo, facebookId, instagramId, linkedinId, githubId } = req.body;

        const user = await User.findById(userId);
        const pictureName = user.picturePath;

        if (!user) return res.status(400);

        if (pictureName !== picturePath && fs.existsSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName))) {
            fs.unlinkSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName));
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                userName: userName,
                phoneNo: phoneNo,
                picturePath: picturePath,
                location: location,
                profession: profession,
                gender: gender,
                about: about,
                graduateYear: graduateYear,
                facebookId: facebookId,
                instagramId: instagramId,
                linkedinId: linkedinId,
                githubId: githubId
            },
            { new: true }
        );
        await Post.updateMany(
            { "userId": userId },
            {
                userPicturePath: picturePath
            },
            { new: true }
        );
        await Post.updateMany(
            {
                comments: { $elemMatch: { userId: userId } }
            },
            {
                $set: {
                    "comments.$.userPicturePath": picturePath
                }
            },
            { new: true }
        );
        res.status(200).json(updateUser);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = verifyToken.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(
            userId, {
            password: passwordHash
        });
        res.status(200).json({ message: "Password Changed" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const verifyUserToken = async (req, res) => {
    try {
        const { token } = req.params;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: "token is valid" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

