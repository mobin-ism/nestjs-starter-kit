import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs/promises'
import * as hbs from 'handlebars'
import * as path from 'path'
import { User } from '../../users/entities/user.entity'
@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    /**
     * SEND USER INVITATION MAIL
     */
    async sendUserInvitationMail(
        userName: string,
        userEmail: string,
        organizationName: string,
        roleName: string,
        uuid: string
    ) {
        const message = `Hello ${userName},
        
        ${organizationName} has invited to join Anchorbooks as ${roleName}. You can collaborate with your team in real-time to manage organizational bookkeeping. Please click on the following link to get started: 
        ${process.env.CLIENT_APP_URL}/auth?invitation=accepted&invitation-code=${uuid} 
        
        If you need any assistance, contact us at info@anchorblock.vc
        
        Best regards, 
        Anchorbooks Organization`

        const msgData = {
            recipent: userName,
            title: `You have been added to ${organizationName} on Anchorbook - Your Accounting Software Solution`,
            message: message,
            redirectTo: `${process.env.APP_URL}`,
            btnTitle: 'Back To Anchorbooks'
        }
        // const template = path.join(__dirname, 'templates', 'email-template.hbs')
        // EMAIL TEMPLATE
        const template = path.join(
            __dirname,
            '..',
            'templates',
            'email-template.hbs'
        )
        const source = await fs.readFile(template, 'utf-8')
        const compiled = hbs.compile(source)

        return this.mailerService.sendMail({
            to: userEmail,
            from: process.env.SMTP_MAIL_FROM,
            subject: `You have been added to ${organizationName} on Anchorbook - Your Accounting Software Solution`,
            html: compiled({ msgData })
        })
    }

    /**
     * SEND A CODE TO RECOVER PASSWORD MAIL
     */
    async sendForgetPasswordCode(userObj: User, code: number) {
        const message = `To update your password, Please verify your account by entering the following verification code: ${code}. Enter the code on the password reset page within the next 2 minutes to complete the process.

        Thank you for choosing Anchorbooks.      
        
        Best regards,
        
        Anchorbooks Support Team.`

        const msgData = {
            recipent: userObj.firstName + ' ' + userObj.lastName,
            title: `Password Reset Verification Code.`,
            message: message,
            redirectTo: `${process.env.APP_URL}`,
            btnTitle: 'Back To Anchorbooks'
        }

        // EMAIL TEMPLATE
        const template = path.join(
            __dirname,
            '..',
            'templates',
            'email-template.hbs'
        )
        const source = await fs.readFile(template, 'utf-8')
        const compiled = hbs.compile(source)

        return this.mailerService.sendMail({
            to: userObj.email,
            from: process.env.SMTP_MAIL_FROM,
            subject: `Password Reset Verification Code for Your Anchorbook account - Your Accounting Software Solution`,
            html: compiled({ msgData })
        })
    }

    /**
     * SEND A CODE TO RECOVER FOR EMAIL VERIFICATION
     */
    async sendEmailVerificationCode(userObj: User, code: number) {
        const message = `Thank you for signing up in Euclido! To ensure the security of your account, we request you to verify your email address by entering the verification code provided below:  ${code}. Enter this code within the next 2 minutes to verify your email. 

        Best regards,
        Euclido - One Supercharged Platform.`

        const msgData = {
            recipent: userObj.firstName + ' ' + userObj.lastName,
            title: `Email Verification Code - Action Required.`,
            message: message,
            redirectTo: `${process.env.APP_URL}`,
            btnTitle: 'Back To Euclido'
        }

        // EMAIL TEMPLATE
        const template = path.join(
            __dirname,
            '..',
            'templates',
            'email-template.hbs'
        )
        const source = await fs.readFile(template, 'utf-8')
        const compiled = hbs.compile(source)

        return this.mailerService.sendMail({
            to: userObj.email,
            from: process.env.SMTP_MAIL_FROM,
            subject: `Email Verification Code - Euclido`,
            html: compiled({ msgData })
        })
    }

    /**
     * SEND A CODE TO RECOVER FOR EMAIL VERIFICATION
     */
    async shareDocumentLink(
        email: string,
        name: string,
        link: string,
        documentType?: string
    ): Promise<void> {
        const message = `
        Dear ${name},
        
        I hope this message finds you well. I am writing to share a ${documentType} document link with you. You can access the ${documentType} by clicking on the link below:

        ${link}

        Please let me know if you encounter any issues or require further assistance. Thank you for your attention.

        Best regards,
        Anchorbooks Support Team.`

        const msgData = {
            recipent: name,
            title: `Anchorbooks ${documentType}.`,
            message: message,
            redirectTo: `${process.env.APP_URL}`,
            btnTitle: 'Go To Anchorbooks'
        }

        // const template = path.join(__dirname, 'templates', 'email-template.hbs')
        // EMAIL TEMPLATE
        const template = path.join(
            __dirname,
            '..',
            'templates',
            'email-template.hbs'
        )
        const source = await fs.readFile(template, 'utf-8')
        const compiled = hbs.compile(source)

        return this.mailerService.sendMail({
            to: email,
            from: process.env.SMTP_MAIL_FROM,
            subject: `${documentType} Link Sharing`,
            html: compiled({ msgData })
        })
    }
}
