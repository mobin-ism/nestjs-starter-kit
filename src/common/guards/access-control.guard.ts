import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AccessControlGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get the required permissions from the route's metadata
        const allowedUserTypes = this.reflector.get<string>(
            'allowedUserTypes',
            context.getHandler()
        )

        const request = context.switchToHttp().getRequest()
        if (request.user.userType) {
            return allowedUserTypes.indexOf(request.user.userType) > -1
                ? true
                : false
        }

        return false
    }
}
