import {
    HttpStatus,
    UnprocessableEntityException,
    ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe as VP } from 'src/common/pipes/validation.pipe'
import { AppModule } from './app.module'
import { swaggerConfig } from './config/swagger.config'
async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new VP())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(errors)
        })
    )
    const options = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true
    }

    app.enableCors(options)

    // SWAGGER CONFIGURATION
    SwaggerModule.setup(
        'docs',
        app,
        SwaggerModule.createDocument(app, swaggerConfig)
    )

    await app.listen(configService.get<number>('APP_PORT', 3000))
}
bootstrap()
