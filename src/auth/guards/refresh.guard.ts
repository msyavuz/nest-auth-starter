import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { jwtConfig } from "../../config/jwt.config";
import { JwtPayload } from "../types";
import { extractTokenFromCookie } from "./utils";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService<jwtConfig>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: FastifyRequest = context.switchToHttp().getRequest();
        const token = extractTokenFromCookie(request);

        if (!token) {
            throw new UnauthorizedException("No bearer token for refresh");
        }
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get("JWT_SECRET_REFRESH"),
                },
            );
            request["user"] = payload;
        } catch {
            throw new UnauthorizedException("Refresh token not verified");
        }
        return true;
    }
}
