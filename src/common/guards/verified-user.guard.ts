import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class VerifiedUserGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get the required permissions from the route's metadata
        const requiredVerifications = this.reflector.get<string>(
            'requiredVerifications',
            context.getHandler()
        )

        const request = context.switchToHttp().getRequest()
        if (Array.isArray(requiredVerifications)) {
            const checkEmailExists = requiredVerifications.includes('email')
            const checkPhoneExists = requiredVerifications.includes('phone')
            if (checkEmailExists) {
                if (!request.user.isEmailVerified) return false
            } else if (checkPhoneExists) {
                if (!request.user.isPhoneVerified) return false
            }
        }

        return true
    }
}
