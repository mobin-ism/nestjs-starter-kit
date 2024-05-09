import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

import {
    EmailVerificationDto,
    ForgetPasswordDto,
    LoginDto,
    RegistrationDto,
    UpdatePasswordDto,
    VerificationCodeSenderDto
} from './dto/auth.dto'
import { AuthService } from './service/auth.service'

@ApiTags('🌏 🔒 Auth API')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: 'Login Endpoint'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Login successful',
        status: HttpStatus.OK
    })
    async login(@Body() loginDto: LoginDto, @Request() req) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Login done successfully',
            result: await this.authService.login(req, loginDto)
        }
    }

    @Post('registration')
    @ApiOperation({
        summary: 'Registration Endpoint'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Registration successful',
        status: HttpStatus.CREATED
    })
    async registration(
        @Body() registrationDto: RegistrationDto,
        @Request() req
    ) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Registration done successfully',
            result: await this.authService.registration(req, registrationDto)
        }
    }

    /**
     * REFRESHING TOKEN ENDPOINT
     */
    @UseGuards(JwtAuthGuard)
    @Get('refresh-access-token')
    @ApiOperation({
        summary: 'Refreshing your access token'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Access token has been refreshed successful',
        status: HttpStatus.CREATED
    })
    @ApiBearerAuth()
    async refreshAccessToken(@Request() req) {
        return {
            status: HttpStatus.CREATED,
            message: 'Access token generated',
            result: await this.authService.refreshToken(req.user)
        }
    }

    /**
     * VERIFY EMAIL ENDPOINT
     */
    @Post('verify-email')
    @ApiOperation({ summary: 'Verifying user email' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'User email verified successfully',
        status: HttpStatus.OK
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
        return {
            status: HttpStatus.OK,
            message: 'Email verification done successfully',
            result: await this.authService.emailVerification(
                emailVerificationDto
            )
        }
    }

    /**
     * REGENERATING EMAIL VERIFICATION CODE
     */
    @Post('regenerate-code')
    @ApiOperation({ summary: 'Code regeneration.' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Code generated successfully',
        status: HttpStatus.OK
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async regenerateAnotherCode(@Body() verificationCodeSenderDto: VerificationCodeSenderDto) {
        return {
            status: HttpStatus.OK,
            message: 'A new code has been sent to your inbox',
            result: await this.authService.generateEmailVerificationCode(verificationCodeSenderDto)
        }
    }

    @Post('forget-password')
    @ApiOperation({ summary: 'Getting a code when you forgot the password' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'A code sent to you mail successfully',
        status: HttpStatus.CREATED
    })
    private async forgetPassword(
        @Body() verificationCodeSenderDto: VerificationCodeSenderDto
    ) {
        return {
            status: HttpStatus.CREATED,
            message: 'Code sent',
            result: await this.authService.forgetPassword(
                verificationCodeSenderDto
            )
        }
    }

    @Post('code-verification')
    @ApiOperation({
        summary: 'Verify the code when you do not know your password'
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Code has been verified successfully',
        status: HttpStatus.OK
    })
    private async codeVerification(
        @Body() forgetPasswordDto: ForgetPasswordDto
    ) {
        return {
            status: HttpStatus.OK,
            message: 'Code verified',
            result: await this.authService.codeVerification(forgetPasswordDto)
        }
    }

    @Post('recover-password')
    @ApiOperation({ summary: 'Update your password' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Password updated successfully',
        status: HttpStatus.OK
    })
    private async recoverPassword(
        @Body() updatePasswordDto: UpdatePasswordDto
    ) {
        return {
            status: HttpStatus.CREATED,
            message: 'Password has been set successfully',
            result: await this.authService.recoverPassword(updatePasswordDto)
        }
    }
}
