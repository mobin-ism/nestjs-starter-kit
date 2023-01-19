import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { jwtConfig } from 'src/config/jwt.config'
import { User } from 'src/modules/users/entities/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './service/auth.service'
import { JwtService } from './service/jwt.service'
import { JwtStrategy } from './strategy/jwt.strategy'
@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy, ConfigService],
    exports: [AuthService]
})
export class AuthModule {}
