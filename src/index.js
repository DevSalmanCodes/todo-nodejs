import express from "express";
import connectDb from "./db/dbConnection.js";
const app = express();
import authRouter from "./routes/auth.route.js";

const PORT = 5000 || 3000;
app.use(express.json());
connectDb().then((_) => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port: ${PORT}`);
  });
  app.use("/api/v1/auth", authRouter);
});
