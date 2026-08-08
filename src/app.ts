import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

import routes from "./routes/index.js";

const app: Express = express();

app.use(helmet());

app.use(morgan("dev"));

const allowedOrigins = [
  "https://locallensai.in",
  "https://web.locallensai.in",
  "http://localhost:3000",
  "http://localhost:5173/",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
