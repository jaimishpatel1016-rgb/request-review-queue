import express from "express";
import cors from "cors";

const app: express.Express = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("Server is healthy");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
