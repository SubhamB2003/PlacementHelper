import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            res.status(403).json({ message: "Access denied" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = isVerified;
        next();

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}