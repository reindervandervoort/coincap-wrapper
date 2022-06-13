import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import { ValidateError } from "tsoa";
import * as expressWinston from "express-winston";
import swaggerUI from "swagger-ui-express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { RegisterRoutes } from "./routes";

import loggerOptions from "./logger-options";
import logger from "./logger";

export default class ExpressConfig {
  app: express.Express;

  constructor() {
    this.app = express();

    this.app.use(cors({ origin: "localhost" }));
    this.app.use(function addCorsHeader(req, res, next) {
      if (req) {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
      next();
    });
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    RegisterRoutes(this.app);

    this.app.use(expressWinston.errorLogger(loggerOptions as expressWinston.ErrorLoggerOptions));

    this.app.use("/logs/", express.static("./logs/"));

    this.app.use("/docs-openapi/", express.static("./api/"));

    this.app.use(
      "/docs",
      swaggerUI.serve,
      swaggerUI.setup(undefined, {
        explorer: true,
        swaggerOptions: {
          urls: [
            {
              url: "/docs-openapi/v1/swagger.json",
              name: "V1",
            },
          ],
        },
      }),
    );

    this.app.use((err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
      if (err instanceof ValidateError) {
        const entry = {
          status: `Caught Validation Error for ${req.path}:`,
          error: err,
        };
        logger.error(entry);
        return res.status(422).json({
          status: 422,
          message: "Validation Failed",
          reason: err?.fields,
        });
      }

      if (err instanceof Error) {
        logger.error(err);
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error",
        });
      }

      return next();
    });
  }
}
