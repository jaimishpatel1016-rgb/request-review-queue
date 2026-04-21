import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { connectDB } from "./db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app: express.Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("Server is healthy");
});

// Main route
app.use("/api", routes);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });

export default app;
