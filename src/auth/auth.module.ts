import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AccessGuard } from "./guards/access.guard";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_ACCESS,
            signOptions: { expiresIn: "15m" },
        }),
        UsersModule,
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AccessGuard,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
