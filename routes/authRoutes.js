const express = require("express");
const { generateWebToken } = require("../utils/utils.js");
const AuthController = require("../controllers/authControllers");

const authRouter = express.Router();
const { signup, login } = AuthController;

authRouter.post("/signup", async (req, res) => {
	try {
		const savedUser = await signup(req.body);
		// Generate a JWT token
		const token = generateWebToken(savedUser._id);

		// Return a success message with the username and token
		res.status(201).json({
			message: "User created successfully",
			username: savedUser.username,
			token,
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to create user",
			message: error.message,
		});
	}
});

//
authRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const loggedUser = await login(email, password);
		const token = generateWebToken(loggedUser._id);

		res.status(201).json({
			message: "user logged in",
			username: loggedUser.username,
			token,
		});
	} catch (error) {
		res.status(500).json({
			error: "Internal Server Error",
			message: error.message,
		});
	}
});

module.exports = authRouter;
