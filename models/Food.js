const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		foodName: {
			type: String,
			required: true,
		},
		calories: {
			type: Number,
			required: true,
		},
		protein: {
			type: Number,
			required: true,
		},
		carbohydrates: {
			type: Number,
			required: true,
		},
		fat: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt fields
	}
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
