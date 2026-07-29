import { AppError } from "../utils/AppError.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const firstError = result.error.errors[0];
      return next(new AppError(firstError.message, 400));
    }

    next();
  };
}