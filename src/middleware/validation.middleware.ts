import { RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";
import * as Api from "../factories/apiErrorFactory";

export const validate = (schema: AnyZodObject): RequestHandler => {
  return async (req, _res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        return next(Api.badRequest("Validation failed", formatted));
      }
      next(error);
    }
  };
};
