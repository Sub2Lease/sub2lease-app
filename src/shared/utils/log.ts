import type { ILogObj } from "tslog";
import { Logger } from "tslog";

const logger: Logger<ILogObj> = new Logger({ name: "turtle" });

export const log = {
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  debug: logger.debug.bind(logger),
  trace: logger.trace.bind(logger),
};
