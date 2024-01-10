import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import User from "../models/User.js";


// READ (PROFILE, SEARCH BAR)
export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await User.findById(userId);

        const user = {
            _id: userData._id,
            userName: userData.userName,
            email: userData.email,
            profession: userData.profession,
            about: userData.about,
            isPicture: userData.isPicture,
            phoneNo: userData.phoneNo,
            location: userData.location,
            gender: userData.gender,
            facebookId: userData.facebookId,
            instagramId: userData.instagramId,
            linkedinId: userData.linkedinId,
            githubId: userData.githubId,
            savePosts: userData.savePosts
        }
        res.status(200).json(user);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await User.find();

        const searchUserFilterData = user.map(
            ({ _id, userName, profession, isPicture }) => {
                return { _id, userName, profession, isPicture };
            }
        );
        res.status(200).json(searchUserFilterData);

    } catch (err) {
        res.status(400).json({ "message": err.message });
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

// READ ( For Forget Password )
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


// UPDATE
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, profession, gender, location, isPicture, about, phoneNo, facebookId, instagramId, linkedinId, githubId } = req.body;

        const userData = await User.findById(userId);
        if (!userData) return res.status(400);

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                userName: userName,
                phoneNo: phoneNo,
                isPicture: isPicture,
                location: location,
                profession: profession,
                gender: gender,
                about: about,
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
                isUserPicture: isPicture
            },
            { new: true }
        );
        await Post.updateMany(
            {
                comments: { $elemMatch: { userId: userId } }
            },
            {
                $set: {
                    "comments.$.isUserPicture": isPicture
                }
            },
            { new: true }
        );

        const user = {
            _id: updateUser._id,
            userName: updateUser.userName,
            email: updateUser.email,
            profession: updateUser.profession,
            about: updateUser.about,
            isPicture: updateUser.isPicture,
            phoneNo: updateUser.phoneNo,
            location: updateUser.location,
            gender: updateUser.gender,
            facebookId: updateUser.facebookId,
            instagramId: updateUser.instagramId,
            linkedinId: updateUser.linkedinId,
            githubId: updateUser.githubId,
            savePosts: updateUser.savePosts
        }
        res.status(200).json(user);

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

export const AddRemoveSavedPost = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const user = await User.findById(userId);

        if (user.savePosts.includes(postId)) {
            user.savePosts = user.savePosts.filter((id) => id !== postId);
        }
        else {
            user.savePosts.push(postId);
        }

        const savePostData = await user.save();
        const savePost = {
            _id: savePostData._id,
            userName: savePostData.userName,
            email: savePostData.email,
            isPicture: savePostData.isPicture,
            profession: savePostData.profession,
            about: savePostData.about,
            gender: savePostData.gender,
            location: savePostData.location,
            phoneNo: savePostData.phoneNo,
            savePosts: savePostData.savePosts,
            facebookId: savePostData.facebookId,
            githubId: savePostData.githubId,
            instagramId: savePostData.instagramId,
            linkedinId: savePostData.linkedinId,
        }
        res.status(200).json(savePost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
