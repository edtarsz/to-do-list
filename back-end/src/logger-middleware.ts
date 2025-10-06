import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.debug(
            `${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`,
        );
        next();
    }
}
