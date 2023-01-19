import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

// Login DTO
export class LoginRequestDto {
    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string
}

// Registration DTO
export class RegisterRequestDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(8)
    readonly password: string
}

// Validate Request DTO
export class ValidateRequestDto {
    @IsString()
    readonly token: string
}
