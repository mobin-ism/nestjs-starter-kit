import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto'
import { AuthService } from './service/auth.service'
@ApiTags('🔒 Auth API')
@Controller('auth')
export class AuthController {
    @Inject(AuthService)
    private readonly service: AuthService

    @Post('register')
    @ApiOperation({ summary: 'Registering a new user' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'User has been created successfully',
        status: HttpStatus.CREATED
    })
    private async register(@Body() registerRequestDto: RegisterRequestDto) {
        try {
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created successfully',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Authentication' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'User has been created successfully',
        status: HttpStatus.CREATED
    })
    private async login(@Body() loginRequestDto: LoginRequestDto) {
        try {
            const result = await this.service.login(loginRequestDto)
            if (result) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'User has logged in successfully',
                    result: result
                }
            } else {
                throw new NotFoundException('Invalid Credentials')
            }
        } catch (error) {
            throw new NotFoundException('Invalid Credentials')
        }
    }

    /**
     * REFRESHING TOKEN ENDPOINT
     */
    @UseGuards(JwtAuthGuard)
    @Get('refresh-access-token')
    @ApiOperation({ summary: 'Refreshing auth token' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Access token has been regenerated successfully',
        status: HttpStatus.CREATED
    })
    refreshAccessToken(@Request() req) {
        return {
            status: HttpStatus.CREATED,
            message: 'Access token generated',
            result: this.service.refreshToken(req.user)
        }
    }
}
