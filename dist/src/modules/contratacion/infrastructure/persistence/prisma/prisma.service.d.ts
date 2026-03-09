import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private dbDisponible;
    onModuleInit(): Promise<void>;
    ensureDbDisponible(): void;
    isDbDisponible(): boolean;
    onModuleDestroy(): Promise<void>;
}
