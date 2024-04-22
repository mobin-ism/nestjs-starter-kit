import { PermissionSet } from 'src/modules/permission/data/permissions.enum'

/**
 * PREDEFINED ROLES FOR EUCLIDO
 *
 */
export enum PredefinedUserRoles {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
    USER = 'user'
}

/**
 * [SuperAdminPermissionsSet description]
 */
export const SuperAdminPermissionSet = [
    PermissionSet.USER,
    PermissionSet.ROLE
] as const

/**
 * [AdminPermissionsSet description]
 */
export const AdminPermissionSet = [
    PermissionSet.USER,
    PermissionSet.ROLE
] as const

/**
 * [UserPermissionsSet description]
 */
export const UserPermissionSet = {} as const
