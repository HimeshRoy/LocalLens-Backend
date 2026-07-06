import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues,
      });
    }

    const data = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (data.body) req.body = data.body as typeof req.body;
    if (data.params) req.params = data.params as typeof req.params;
    if (data.query) {
      Object.assign(req.query, data.query);
    }

    next();
  };
};
