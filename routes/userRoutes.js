const mongoose = require("mongoose");
const express = require("express");
const User = mongoose.model("User");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		res.json({
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicture: user.profilePicture,
			bodyWeight: user.bodyWeight,
			email: user.email,
		});
	} catch (error) {
		res.status(500).json({ message: "Cannot find User", error: error.message });
	}
});

userRouter.delete("/", async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.userId);

		if (!deletedUser) {
			// If the user is not found, return a 404 response
			return res.status(404).json({ message: "User not found" });
		}
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Cannot delete user", error: error.message });
	}
});

userRouter.post("/", async (req, res) => {
	try {
		// Retrieve the user based on the userId from req.userId
		const user = await User.findById(req.userId);

		if (!user) {
			// If the user is not found, return a 404 response
			return res.status(404).json({ message: "User not found" });
		}

		// Check if req.body contains 'email' or 'password' and reject the update if present
		if (req.body.email || req.body.password) {
			return res
				.status(400)
				.json({ message: "Cannot update email or password" });
		}

		Object.assign(user, req.body);

		// Save the updated user to the database
		await user.save();

		// Return the updated user as a JSON response
		res.json({
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicture: user.profilePicture,
			bodyWeight: user.bodyWeight,
			email: user.email,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Cannot update user", error: error.message });
	}
});

module.exports = userRouter;
