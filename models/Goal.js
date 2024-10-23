const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		goalName: {
			type: String,
			required: true,
		},
		goalDescription: {
			type: String,
			required: true,
		},
		targetDate: {
			type: Date,
			required: true,
		},
		targetCaloriesValue: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["In Progress", "Achieved", "Abandoned"],
			default: "In Progress",
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt fields
	}
);

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
