const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { generateHashedPassword } = require("../utils/utils.js");
const User = mongoose.model("User");

async function signup(userDetails) {
	try {
		const { email, password } = userDetails;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new Error("Email already exists");
		}
		const hashedPassword = await generateHashedPassword(password);
		const newUser = new User({
			...userDetails,
			email,
			password: hashedPassword,
		});
		const savedUser = await newUser.save();

		return savedUser;
	} catch (error) {
		throw error;
	}
}

//
async function login(email, password) {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new Error("Invalid password");
		}

		return user;
	} catch (error) {
		throw error;
	}
}

module.exports = { signup, login };
