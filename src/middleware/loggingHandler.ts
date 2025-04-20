import morgan from "morgan";
import { IncomingMessage, ServerResponse } from "http";
import chalk from "chalk";

export const productionFormat: morgan.FormatFn<
  IncomingMessage,
  ServerResponse
> = (tokens, req, res): string => {
  const status = Number(tokens.status(req, res)) || 0;

  const statusColor = status
    ? (status >= 500
        ? chalk.red
        : status >= 400
        ? chalk.yellow
        : status >= 300
        ? chalk.cyan
        : chalk.green)(status.toString())
    : chalk.gray("-");

  const timedMsg = tokens.timed ? chalk.magenta(tokens.timed(req, res)) : "";

  return [
    // Remote address
    chalk.white(tokens["remote-addr"](req, res) || "-"),

    // DateTime in CLF format
    chalk.gray(`[${tokens.date(req, res, "clf")}]`),

    // Request method and URL
    chalk.blue(tokens.method(req, res)),
    chalk.blue(tokens.url(req, res)),
    chalk.gray("HTTP/"),
    chalk.gray(tokens["http-version"](req, res)),

    // Status and response size
    statusColor,
    chalk.white(tokens.res(req, res, "content-length") || "-"),

    // Referrer and User agent
    chalk.gray(`"${tokens.referrer(req, res) || "-"}"`),
    chalk.gray(`"${tokens["user-agent"](req, res) || "-"}"`),

    // Response time
    chalk.yellow(`${tokens["response-time"](req, res) || "-"}ms`),

    // Custom "timed" token output
    timedMsg,
  ].join(" ");
};

export const devFormat: morgan.FormatFn<IncomingMessage, ServerResponse> = (
  tokens,
  req,
  res
): string => {
  return [
    "A new",
    chalk.green(tokens.method(req, res)),
    "request for",
    chalk.blue(tokens.url(req, res)),
    "was received. It took",
    chalk.yellow(`${tokens["response-time"](req, res) || "-"}ms`),
    "milliseconds to be resolved.",
  ].join(" ");
};
