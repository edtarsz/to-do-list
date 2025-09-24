import path from 'node:path'
// Carga las variables de entorno (.env)
import 'dotenv/config'
import type { PrismaConfig } from 'prisma'

// Es usado para que el CLI de Prisma sepa donde está el schema
export default {
    schema: path.join(__dirname, 'prisma', 'schema', 'schema.prisma'),
} satisfies PrismaConfig