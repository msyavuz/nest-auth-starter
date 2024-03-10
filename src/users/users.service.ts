import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./db/users.schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(@Inject("DB") private drizzle: LibSQLDatabase<typeof schema>) {}
    async create(createUserDto: CreateUserDto) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            saltOrRounds,
        );
        return await this.drizzle.insert(schema.users).values({
            username: createUserDto.username,
            hashedPass: hashedPassword,
            email: createUserDto.email,
        });
    }

    async findAll() {
        return await this.drizzle.query.users.findMany();
    }

    async findOne(id: number) {
        return await this.drizzle.query.users.findFirst({
            where: (users) => eq(users.id, id),
        });
    }

    async findOneByUsername(username: string) {
        return await this.drizzle.query.users.findFirst({
            where: (users) => eq(users.username, username),
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.drizzle
            .update(schema.users)
            .set(updateUserDto)
            .where(eq(schema.users.id, id))
            .returning({ updatedId: schema.users.id });
    }

    async remove(id: number) {
        return await this.drizzle
            .delete(schema.users)
            .where(eq(schema.users.id, id))
            .returning({ deletedId: schema.users.id });
    }
}
