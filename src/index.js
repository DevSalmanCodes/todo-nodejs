import express from "express";
import connectDb from "./db/dbConnection.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import authRouter from "./routes/auth.route.js";
import isAuthorizedUser from "./middlewares/auth.middleware.js";

const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDb(process.env.MONGO_DB_URI).then((_) => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port: ${PORT}`);
  });

  app.use("/api/v1/auth", authRouter);
  app.get("/home", isAuthorizedUser, (req, res) => res.send("Hello"));
});
