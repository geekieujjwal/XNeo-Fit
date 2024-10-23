const express = require("express");
const mongoose = require("mongoose");
const Exercise = mongoose.model("Exercise");
const User = mongoose.model("User");
const exerciseRouter = express.Router();

exerciseRouter.get("/", async (req, res) => {
	try {
		const userId = req.userId;
		const exercises = await Exercise.find({ userId: userId });

		const exerciseGroups = {};

		exercises.forEach((exercise) => {
			// Extract the date part from the createdAt timestamp
			const exerciseDate = exercise.createdAt.toDateString();

			if (!exerciseGroups[exerciseDate]) {
				exerciseGroups[exerciseDate] = {
					date: exercise.createdAt,
					exercises: [],
				};
			}

			exerciseGroups[exerciseDate].exercises.push({
				exerciseName: exercise.exerciseName,
				duration: exercise.duration,
				caloriesBurned: exercise.caloriesBurned,
				exerciseId: exercise._id,
			});
		});

		// Convert the object into an array of grouped exercises
		const groupedExercises = Object.values(exerciseGroups);

		// Sort the grouped exercises by date in descending order (latest exercises first)
		groupedExercises.sort((a, b) => b.date - a.date);

		res.json(groupedExercises);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

exerciseRouter.post("/", async (req, res) => {
	try {
		const { exerciseName, duration, metabolicEquivalent } = req.body;

		const parsedDuration = parseFloat(duration);
		const parsedMetabolicEquivalent = parseFloat(metabolicEquivalent);

		if (isNaN(parsedDuration) || isNaN(parsedMetabolicEquivalent)) {
			return res
				.status(400)
				.json({ error: "Invalid duration or metabolicEquivalent" });
		}
		const user = await User.findById(req.userId);

		const caloriesBurned =
			((3.5 * parsedMetabolicEquivalent * user.bodyWeight) / 200) *
			parsedDuration;

		const newExercise = new Exercise({
			userId: req.userId,
			exerciseName,
			duration,
			caloriesBurned,
		});

		const savedExercise = await newExercise.save();
		res.status(201).json(savedExercise);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

exerciseRouter.delete("/:exerciseId", async (req, res) => {
	try {
		const exerciseId = req.params.exerciseId;
		const deletedExercise = await Exercise.findByIdAndRemove(exerciseId);

		if (!deletedExercise) {
			throw new Error("No exercise found.");
		}
		res.sendStatus(204); // Send a 204 status code (No Content)
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

module.exports = exerciseRouter;
