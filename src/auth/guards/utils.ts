import type { FastifyRequest } from "fastify";

export function extractTokenFromHeader(request: FastifyRequest) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
}

export function extractTokenFromCookie(request: FastifyRequest) {
    const token = request.cookies["refresh_token"];
    return token;
}
