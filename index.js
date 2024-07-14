import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { customLogger } from "./middleware/morganLogger.js";
// app config
const app = express();
const port = process.env.PORT || 4000;
const host = '0.0.0.0'

// db connection
connectDB();

// middleware
app.use(customLogger);
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, host,() => {
  console.log(`Server started at http://${host}:${port}`);
});
