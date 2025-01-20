import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";

import { router } from "./api/routes/routes";

const corsOptions: CorsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

app.use((error: any, request: Request, response: Response, next: NextFunction): any => {
  if (error instanceof Error) {
    return response.status(400).json({
      error: error.message
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error"
  });
})

const server = app.listen(3001, () => console.log("Rodando projeto blog_escolar na porta 3001"));

export { app, server };
