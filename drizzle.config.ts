import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv"

dotenv.config()

export default {
    driver: "turso",
    schema: [
        "./src/*/db/*.schema.ts",
    ],
    dbCredentials: {
        url: process.env.DB_URL!,
        authToken: process.env.DB_TOKEN! 
    },
} satisfies Config;
