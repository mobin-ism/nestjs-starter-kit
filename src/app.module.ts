import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmAsyncConfig } from 'src/config/typeorm.config'
import { UsersModule } from 'src/modules/users/users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import smtpConfig from './config/smtp.config'
import { AuthModule } from './modules/auth/auth.module'
import { EmailService } from './modules/email/services/email.service'
import { PermissionModule } from './modules/permission/permission.module'
import { RoleModule } from './modules/role/role.module'
import { WebsocketModule } from './modules/websocket/websocket.module'
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            cache: true
        }),
        ThrottlerModule.forRootAsync({
            useFactory: async () => ({
                throttlers: [
                    {
                        ttl:
                            parseInt(
                                process.env.RATE_LIMITER_TIME_TO_LEAVE,
                                10
                            ) || 60000, // default to 60000 if env variable not present
                        limit:
                            parseInt(process.env.RATE_LIMITER_MAX_TRY, 10) || 2 // default to 2 if env variable not present
                    }
                ]
            })
        }),
        MailerModule.forRootAsync(smtpConfig),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        RoleModule,
        PermissionModule,
        WebsocketModule
    ],
    controllers: [AppController],
    providers: [AppService, EmailService],
    exports: [TypeOrmModule]
})
export class AppModule {}
