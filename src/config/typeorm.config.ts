import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions
} from '@nestjs/typeorm'

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'password'),
            database: configService.get('DB_NAME', 'nestjs-starter-kit'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            extra: {
                charset: 'utf8mb4_unicode_ci'
            },
            synchronize: true,
            logging: false
        }
    }
}

// import { config } from 'dotenv'
// import { DataSourceOptions } from 'typeorm'
// import { SeederOptions } from 'typeorm-extension'

// config()

// export const dataSourceOptions: DataSourceOptions & SeederOptions = {
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: +process.env.DB_PORT,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     synchronize: true,
//     logging: false,
//     extra: {
//         charset: 'utf8mb4_unicode_ci'
//     },
//     seeds: ['src/database/seeds/**/*{.ts,.js}'],
//     factories: ['src/database/factories/**/*{.ts,.js}']
// }

// import { ConfigModule } from '@nestjs/config'
// import { TypeOrmModule } from '@nestjs/typeorm'

// export const databaseProvider = TypeOrmModule.forRootAsync({
//     imports: [ConfigModule],
//     useFactory: async () => ({
//         type: 'postgres',
//         host: process.env.DB_HOST,
//         port: +process.env.DB_PORT,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         entities: ['dist/resources/**/*.entity.js'],
//         synchronize: true,
//         logging: false,
//         extra: {
//             charset: 'utf8mb4_unicode_ci'
//         },
//         seeds: ['dist/db/seeds/**/*.js'],
//         factories: ['dist/db/factories/**/*.js']
//     })
// })
