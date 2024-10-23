const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

function generateWebToken(userId) {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET);

	return token;
}

async function generateHashedPassword(password) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

module.exports = { generateWebToken, generateHashedPassword };
