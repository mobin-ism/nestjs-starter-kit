import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Starter Kit')
    .setDescription('This is the collection of APIs.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
