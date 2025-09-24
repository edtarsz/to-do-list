import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PrismaErrorService {
    private prismaErrorMap: Record<string, any> = {
        P2002: ConflictException,   // Unique constraint failed
        P2003: ConflictException,   // Foreign key constraint failed
        P2025: NotFoundException,   // Not found
    };

    handleError(error: any, message: string): never {
        console.error(error);

        const ExceptionClass = this.prismaErrorMap[error.code];
        if (ExceptionClass) {
            throw new ExceptionClass(`${message}: ${error.meta?.target || error.message}`);
        }

        throw new InternalServerErrorException(`${message}: ${error.message}`);
    }
}