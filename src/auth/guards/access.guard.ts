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
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { extractTokenFromHeader } from "./utils";

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService<jwtConfig>,
        private reflector: Reflector,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: FastifyRequest = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        if (!token) {
            throw new UnauthorizedException("No bearer token for access");
        }
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get("JWT_SECRET_ACCESS"),
                },
            );
            request["user"] = payload;
        } catch {
            throw new UnauthorizedException("Access token not verified");
        }
        return true;
    }
}
