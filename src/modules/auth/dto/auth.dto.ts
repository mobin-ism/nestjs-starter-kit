import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MinLength
} from 'class-validator'

import { IsEnum, IsOptional } from 'class-validator'
import { ValidationMessage } from 'src/common/filters/validation.messages'
import { UserTypes } from 'src/modules/users/data/user-type.enum'

export class LoginDto {
    @IsString({
        message: ValidationMessage('email').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('email').isNotEmpty
    })
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString({
        message: ValidationMessage('password').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('password').isNotEmpty
    })
    @ApiProperty()
    password: string
}

export class RegistrationDto {
    @IsString({
        message: ValidationMessage('email').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('email').isNotEmpty
    })
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString({
        message: ValidationMessage('username').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('username').isNotEmpty
    })
    @IsString({
        message: ValidationMessage('username').isString
    })
    @ApiProperty()
    username: string

    @IsString({
        message: ValidationMessage('Name').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('Name').isNotEmpty
    })
    @ApiProperty()
    name: string

    @IsString({
        message: ValidationMessage('Password').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('Password').isNotEmpty
    })
    @MinLength(6)
    @ApiProperty()
    password: string

    @IsString({
        message: ValidationMessage('Confirm Password').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('Confirm Password').isNotEmpty
    })
    @MinLength(6)
    @ApiProperty()
    confirmPassword: string

    @IsString({
        message: ValidationMessage('user type').isString
    })
    @IsEnum(UserTypes, {
        message: 'user type must be either "Supervisor" or "Student"'
    })
    @IsNotEmpty({
        message: ValidationMessage('user type').isNotEmpty
    })
    @ApiProperty({
        description: 'List of user types',
        isArray: true,
        enum: UserTypes,
        example: Object.keys(UserTypes)
    })
    userType: string

    @IsString({
        message: ValidationMessage('auth provider').isString
    })
    @IsOptional()
    @ApiProperty()
    authProvider: string

    @IsString({
        message: ValidationMessage('avatar url').isString
    })
    @IsOptional()
    @ApiProperty()
    avatarUrl: string
}

export class EmailVerificationDto {
    @IsString({
        message: ValidationMessage('email').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('email').isNotEmpty
    })
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString({
        message: ValidationMessage('code').isString
    })
    @IsNotEmpty({
        message: ValidationMessage('code').isNotEmpty
    })
    @ApiProperty()
    code: string
}

export class UpdatePasswordDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    hash: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    userUuid: string

    @IsString()
    @MinLength(6)
    @ApiProperty()
    newPassword: string

    @IsString()
    @MinLength(6)
    @ApiProperty()
    confirmPassword: string
}

export class ForgetPasswordDto {
    @IsString()
    @Length(6)
    @ApiProperty()
    code: string

    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string
}

export class CodeSenderOnForgotPasswordDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string
}
