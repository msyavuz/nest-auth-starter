import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/signin.dto";
import { JwtPayload, Tokens } from "./types";
import { ConfigService } from "@nestjs/config";
import { jwtConfig } from "../config/jwt.config";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService<jwtConfig>,
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}

    refresh(user: JwtPayload) {
        return this.generateTokens({
            sub: user.sub,
            username: user.username,
        });
    }

    async signUp(createUserDto: CreateUserDto) {
        await this.usersService.create(createUserDto);

        const user = await this.usersService.findOneByUsername(
            createUserDto.username,
        );

        if (user) {
            const payload: JwtPayload = {
                sub: user.id,
                username: user.username,
            };
            return this.generateTokens(payload);
        }
        throw new ConflictException();
    }

    async login({ username, password }: SignInDto) {
        const user = await this.validateUser(username, password);

        if (user) {
            const payload: JwtPayload = {
                sub: user.id,
                username: user.username,
            };
            return this.generateTokens(payload);
        }
        throw new UnauthorizedException();
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);

        const passed =
            (await bcrypt.compare(password, user?.hashedPass ?? "")) && !!user;

        if (passed) {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
            };
        }
        return null;
    }

    async verifyToken(token: string, type: "access" | "refresh") {
        return this.jwtService.verifyAsync(token, {
            secret:
                type === "access"
                    ? this.configService.getOrThrow("JWT_SECRET_ACCESS")
                    : this.configService.getOrThrow("JWT_SECRET_REFRESH"),
        });
    }

    async generateToken(
        payload: JwtPayload,
        type: "access" | "refresh" = "access",
    ): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: type === "access" ? "15m" : "7d",
            secret:
                type === "access"
                    ? this.configService.getOrThrow("JWT_SECRET_ACCESS")
                    : this.configService.getOrThrow("JWT_SECRET_REFRESH"),
        });
    }

    async generateTokens(payload: JwtPayload): Promise<Tokens> {
        return {
            access_token: await this.generateToken(payload, "access"),
            refresh_token: await this.generateToken(payload, "refresh"),
        };
    }
}
