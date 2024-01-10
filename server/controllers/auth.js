import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// REGISTER
export const Register = async (req, res) => {
    try {
        const { userName, email, password, profession, about } = req.body;

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(401).json("Email already exists.");
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ userName, email, password: passwordHash, profession, about });
        await newUser.save();

        res.status(201).json({ message: "User successfully register." });

    } catch (err) {
        res.status(200).json({ message: err.message });
    }
}


// LOGIN
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email: email });
        if (!userData) return res.status(400).json({ message: "User does't exists." });

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials." });

        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);

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
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
















