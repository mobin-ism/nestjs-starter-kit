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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto'
import { AuthService } from './service/auth.service'
@Controller('auth')
export class AuthController {
    @Inject(AuthService)
    private readonly service: AuthService

    @Post('register')
    private async register(@Body() registerRequestDto: RegisterRequestDto) {
        try {
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    @Post('login')
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
    refreshAccessToken(@Request() req) {
        return {
            status: HttpStatus.CREATED,
            message: 'Access token generated',
            result: this.service.refreshToken(req.user)
        }
    }
}
