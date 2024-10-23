const express = require("express");
const mongoose = require("mongoose");
const Food = mongoose.model("Food");
const foodRouter = express.Router();

foodRouter.get("/", async (req, res) => {
	try {
		const userId = req.userId;
		const foodItems = await Food.find({ userId: userId });

		const foodGroups = {};

		foodItems.forEach((foodItem) => {
			// Extract the date part from the createdAt timestamp
			const foodDate = foodItem.createdAt.toDateString();

			if (!foodGroups[foodDate]) {
				foodGroups[foodDate] = {
					date: foodItem.createdAt,
					foodItems: [],
				};
			}

			foodGroups[foodDate].foodItems.push({
				foodName: foodItem.foodName,
				calories: foodItem.calories,
				protein: foodItem.protein,
				carbohydrates: foodItem.carbohydrates,
				fat: foodItem.fat,
				foodId: foodItem._id,
			});
		});

		// Convert the object into an array of grouped food items
		const groupedFoodItems = Object.values(foodGroups);

		// Sort the grouped food items by date in descending order (latest items first)
		groupedFoodItems.sort((a, b) => b.date - a.date);

		res.json(groupedFoodItems);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

foodRouter.post("/", async (req, res) => {
	try {
		const { foodName, protein, carbohydrates, fat } = req.body;

		// Validate the input data
		if (!foodName || typeof foodName !== "string") {
			return res
				.status(400)
				.json({ error: "Food Name is required and must be a string" });
		}

		const parsedProtein = parseFloat(protein);
		const parsedCarbs = parseFloat(carbohydrates);
		const parsedFat = parseFloat(fat);

		if (isNaN(parsedProtein) || isNaN(parsedCarbs) || isNaN(parsedFat)) {
			return res.status(400).json({
				error: " Protein, Carbohydrates, and Fat must be valid numbers",
			});
		}

		const calories = parseFloat(
			4 * (parsedProtein + parsedCarbs) + 9 * parsedFat
		);

		const newFood = new Food({
			userId: req.userId,
			foodName,
			calories,
			protein: parsedProtein,
			carbohydrates: parsedCarbs,
			fat: parsedFat,
		});

		const savedFood = await newFood.save();
		res.status(201).json(savedFood);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

foodRouter.delete("/:foodId", async (req, res) => {
	try {
		const foodId = req.params.foodId;
		const deletedFood = await Food.findByIdAndRemove(foodId);

		if (!deletedFood) {
			throw new Error("No food item found.");
		}
		res.sendStatus(204);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal Server Error", message: error.message });
	}
});

module.exports = foodRouter;
