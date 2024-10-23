require("./utils/db");
require("./models/User");
require("./models/Exercise");
require("./models/Food");
require("./models/Goal");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const exerciseRouter = require("./routes/exerciseRoutes");
const foodRouter = require("./routes/foodRoutes");
const goalRouter = require("./routes/goalRoutes");
const userRouter = require("./routes/userRoutes");
const requiresAuth = require("./middlewares/requiresAuth");

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//Routers
app.use("/v1/auth", authRouter);
app.use("/v1/exercises", requiresAuth, exerciseRouter);
app.use("/v1/food", requiresAuth, foodRouter);
app.use("/v1/goal", requiresAuth, goalRouter);
app.use("/v1/user", requiresAuth, userRouter);

app.get("/", (req, res) => {
  res.send("Hello this is a Xneo Fit API by Ujjwal.");
});

//server starting
app.listen(3000, () => {
  console.log("server started at port 3000...");
});
