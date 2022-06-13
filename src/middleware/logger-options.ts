import * as Winston from "winston";

class TimestampFirst {
  enabled = true;

  constructor(enabled?: boolean) {
    if (enabled !== undefined) this.enabled = enabled;
  }

  transform<T>(obj: T): T {
    if (this.enabled) {
      return {
        timestamp: (obj as unknown as { timestamp: unknown }).timestamp,
        ...obj,
      };
    }
    return obj;
  }
}

const myFormat = Winston.format.combine(
  Winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  new TimestampFirst(true),
  // Winston.format.splat(),
  Winston.format.simple(),
);

const transports: Winston.transport[] = [
  new Winston.transports.Console({
    format: myFormat,
  }),
];

const LoggerOptions: Winston.LoggerOptions = { transports };

export default LoggerOptions;
