import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength
} from 'class-validator'

// Login DTO
export class LoginRequestDto {
    @IsEmail()
    @ApiProperty()
    readonly email: string

    @IsString()
    @ApiProperty()
    readonly password: string
}

// Registration DTO
export class RegisterRequestDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string

    @IsEmail()
    @ApiProperty()
    readonly email: string

    @IsString()
    @MinLength(8)
    @ApiProperty()
    readonly password: string

    @IsNumber()
    @ApiProperty()
    readonly roleId: number
}

// Validate Request DTO
export class ValidateRequestDto {
    @IsString()
    @ApiProperty()
    readonly token: string
}
