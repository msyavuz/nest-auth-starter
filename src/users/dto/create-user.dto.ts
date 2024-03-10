import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    // TODO: define these elsewhere to avoid magic numbers
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
    })
    @IsNotEmpty()
    readonly password: string;
}
