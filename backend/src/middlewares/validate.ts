import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '@/utils/errors';

type ValidationTargets = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTargets = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      throw new BadRequestError('Validation failed', result.error.flatten().fieldErrors);
    }
    req[target] = result.data as never;
    next();
  };
}
