import {
    sqliteTable,
    text,
    integer,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
    "users",
    {
        id: integer("id").primaryKey(),
        email: text("email").notNull().unique(),
        username: text("username").notNull().unique(),
        hashedPass: text("hashed_password").notNull(),
    },
    (users) => ({ emailIdx: uniqueIndex("email_index").on(users.email) }),
);
