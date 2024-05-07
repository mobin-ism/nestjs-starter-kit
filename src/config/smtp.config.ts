import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
const smtpConfig = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<any> => {
        return {
            transport: {
                host: configService.get('SMTP_HOST'),
                auth: {
                    user: configService.get('SMTP_USER'),
                    pass: configService.get('SMTP_PASSWORD')
                }
            },
            template: {
                dir: join(__dirname, '../modules/email/templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        }
    }
}

export default smtpConfig
