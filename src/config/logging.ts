import chalk from "chalk";
import { environment } from "./environment";

export function getCallingFunction(error: Error) {
  try {
    const stack = error.stack;
    if (!stack) return "--";
    const line = stack.split("\n")[2];
    const regex = /^.*at\s([a-zA-Z]+).*$/;
    const groups = line.match(regex);
    return groups && groups[1] ? groups[1] : "--";
  } catch {
    return "--";
  }
}

export function log(message?: any, ...optionalParams: any[]) {
  if (
    !environment.nodeEnv ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "development"
  )
    console.log(
      `[${new Date().toLocaleString()}]`,
      chalk.magenta("[SERVER-LOG]"),
      message,
      ...optionalParams
    );
}

export function info(message?: any, ...optionalParams: any[]) {
  if (
    !environment.nodeEnv ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "development"
  )
    console.info(
      `[${new Date().toLocaleString()}]`,
      chalk.cyan("[INFO]"),
      chalk.bgGreen(`[${getCallingFunction(new Error())}]`),
      message,
      ...optionalParams
    );
}

export function warn(message?: any, ...optionalParams: any[]) {
  if (!environment.nodeEnv || process.env.NODE_ENV === "development")
    console.warn(
      `[${new Date().toLocaleString()}]`,
      chalk.yellow("[WARN]"),
      chalk.bgGreen(`[${getCallingFunction(new Error())}]`),
      message,
      ...optionalParams
    );
}

export function error(message?: any, ...optionalParams: any[]) {
  if (!environment.nodeEnv || process.env.NODE_ENV === "development")
    console.error(
      `[${new Date().toLocaleString()}]`,
      chalk.red("[ERROR]"),
      chalk.bgGreen(`[${getCallingFunction(new Error())}]`),
      message,
      ...optionalParams
    );
}

const logging = {
  log,
  info,
  warn,
  error,
  warning: warn,
  getCallingFunction,
};

/** Create the global definition */
declare global {
  var logging: {
    log: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    warning: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    getCallingFunction: (error: Error) => string;
  };
}

/** Link the local and global variable */
globalThis.logging = logging;

export default logging;
