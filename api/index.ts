import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
app.use(cookieParser());

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

registerRoutes(httpServer, app).then(() => {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
});

export default serverless(app);
