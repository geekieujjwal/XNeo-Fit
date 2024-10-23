const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function requiresAuth(req, res, next) {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ message: "Authorization token is missing" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
}

module.exports = requiresAuth;
