import path from 'node:path'
import 'dotenv/config'
import type { PrismaConfig } from 'prisma'

// Configuración para que el CLI de Prisma sepa donde está el schema
export default {
    schema: path.join(__dirname, 'prisma', 'schema', 'schema.prisma'),
} satisfies PrismaConfig