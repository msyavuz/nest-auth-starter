import { Module } from "@nestjs/common";
import { DrizzleTursoModule } from "@knaadh/nestjs-drizzle-turso";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { users } from "./users/db/users.schema";
import * as Joi from "joi";
import { databaseConfig } from "./config/database.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_URL: Joi.string(),
                DB_TOKEN: Joi.string(),
                JWT_SECRET_ACCESS: Joi.string(),
                JWT_SECRET_REFRESH: Joi.string(),
            }),
        }),
        DrizzleTursoModule.registerAsync({
            tag: "DB",
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService<databaseConfig>,
            ) => ({
                turso: {
                    config: {
                        url: configService.getOrThrow("DB_URL"),
                        authToken: configService.getOrThrow<string>("DB_TOKEN"),
                    },
                },
                config: {
                    schema: {
                        users,
                    },
                },
            }),
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
