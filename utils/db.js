const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Access your MongoDB connection string from secrets
console.log(process.env.MONGO_URI);
const mongoURI = process.env.MONGO_URI;

mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});
