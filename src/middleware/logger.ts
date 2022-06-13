import * as Winston from "winston";
import LoggerOptions from "./logger-options";

const logger = Winston.createLogger(LoggerOptions);

process.on("unhandledRejection", function reject(reason, p) {
  logger.warn("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

export default logger;
