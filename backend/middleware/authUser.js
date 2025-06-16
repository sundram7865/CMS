// authUser.js
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decode.id }; // ✅ Best place to put authenticated user info
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
