const express = require("express");
const mongoose = require("mongoose");
const Goal = mongoose.model("Goal");
const User = mongoose.model("User");
const goalRouter = express.Router();

goalRouter.get("/", async (req, res) => {
	try {
		const goals = await Goal.find({ userId: req.userId });
		res.json(goals);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

goalRouter.post("/", async (req, res) => {
	try {
		const {
			goalName,
			goalDescription,
			targetDate,
			targetCaloriesValue,
			status,
		} = req.body;

		// Validate the input data
		if (!goalName || typeof goalName !== "string") {
			return res
				.status(400)
				.json({ error: "Goal Name is required and must be a string" });
		}

		if (!goalDescription || typeof goalDescription !== "string") {
			return res
				.status(400)
				.json({ error: "Goal Description is required and must be a string" });
		}

		if (!targetDate || isNaN(Date.parse(targetDate))) {
			return res
				.status(400)
				.json({ error: "Target Date is required and must be a valid date" });
		}

		if (isNaN(targetCaloriesValue)) {
			return res
				.status(400)
				.json({ error: "Target Calories Value must be a valid number" });
		}

		if (
			typeof status !== "string" ||
			!["In Progress", "Achieved", "Abandoned"].includes(status)
		) {
			return res.status(400).json({
				error: "Status must be one of: 'In Progress', 'Achieved', 'Abandoned'",
			});
		}

		const newGoal = new Goal({
			userId: req.userId,
			goalName,
			goalDescription,
			targetDate,
			targetCaloriesValue,
			status,
		});

		const savedGoal = await newGoal.save();
		res.status(201).json(savedGoal);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

goalRouter.delete("/:goalId", async (req, res) => {
	try {
		const goalId = req.params.goalId;
		const deletedGoal = await Goal.findByIdAndRemove(goalId);

		if (!deletedGoal) {
			throw new Error("No fitness goal found.");
		}
		res.sendStatus(204); // Send a 204 status code (No Content)
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

goalRouter.post("/:goalId", async (req, res) => {
	try {
		const goalId = req.params.goalId;
		const updatedGoalData = req.body;
		const updatedGoal = await Goal.findByIdAndUpdate(goalId, updatedGoalData, {
			new: true,
		});

		if (!updatedGoal) {
			return res.status(404).json({ message: "Goal not found" });
		}
		res.json(updatedGoal);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Cannot update goal", error: error.message });
	}
});

module.exports = goalRouter;
