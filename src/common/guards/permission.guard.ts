import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get the required permissions from the route's metadata
        const requiredPermission = this.reflector.get<string[]>(
            'permission',
            context.getHandler()
        )

        // get the required permissions from the route's metadata
        const allowedUserTypes = this.reflector.get<string>(
            'allowedUserTypes',
            context.getHandler()
        )

        const request = context.switchToHttp().getRequest()
        if (
            request.user.userType === 'superadmin' &&
            request.user.role.slug === 'superadmin' &&
            request.user.role.isDefault
        ) {
            return true
        } else if (
            allowedUserTypes &&
            allowedUserTypes.length &&
            allowedUserTypes.indexOf(request.user.role.slug) > -1 &&
            request.user.role.isDefault
        ) {
            return true
        } else if (request.user.role.permissions.length) {
            const permissionExists = request.user.role.permissions.some(
                (permission) => {
                    if (requiredPermission && requiredPermission.length) {
                        return requiredPermission.includes(
                            permission.permission
                        )
                    }
                }
            )

            return permissionExists ? true : false
        }

        return false
    }
}
