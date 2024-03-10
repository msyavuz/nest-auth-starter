import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import fastifyCookie from "@fastify/cookie";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const config = new DocumentBuilder()
        .setTitle("Nest Auth Starter")
        .addBearerAuth()
        .addCookieAuth("refresh_token")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    const configService = app.get(ConfigService);

    await app.register(fastifyCookie, {
        secret: configService.getOrThrow("COOKIE_SECRET"),
    });

    const port = configService.get("PORT");

    await app.listen(port ? port : 3000, "0.0.0.0");
}
bootstrap();
