import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { SignInDto } from "./dto/signin.dto";
import { WithAccessToken, JwtPayload } from "./types";
import { RefreshGuard } from "./guards/refresh.guard";
import { Public } from "./decorators/public.decorator";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "./decorators/user.decorator";
import { FastifyReply } from "fastify";

@ApiTags("Auth")
@ApiCookieAuth()
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("refresh")
    @Public()
    @UseGuards(RefreshGuard)
    async refresh(
        @User() user: JwtPayload,
        @Res({ passthrough: true }) response: FastifyReply,
    ): Promise<WithAccessToken> {
        const tokens = await this.authService.refresh(user);

        response.setCookie("refresh_token", tokens.refresh_token, {
            httpOnly: true,
        });
        return {
            access_token: tokens.access_token,
        };
    }

    @Post("login")
    @Public()
    async login(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) response: FastifyReply,
    ): Promise<WithAccessToken> {
        const tokens = await this.authService.login(signInDto);
        response.setCookie("refresh_token", tokens.refresh_token);

        return {
            access_token: tokens.access_token,
        };
    }

    @Post("register")
    @Public()
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) response: FastifyReply,
    ) {
        const tokens = await this.authService.signUp(createUserDto);
        response.setCookie("refresh_token", tokens.refresh_token);

        return {
            access_token: tokens.access_token,
        };
    }
}
