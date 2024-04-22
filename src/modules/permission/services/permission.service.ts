import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import slugify from 'slugify'
import { UserPermissionSet } from 'src/modules/role/data/predefined-roles.enum'
import { Repository } from 'typeorm'
import { Permission } from '../../role/entities/permission.entity'
import { Role } from '../../role/entities/role.entity'
import { PermissionSet } from '../data/permissions.enum'
@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    /**
     * IMPORT THE DEFAULT PERMISSIONS
     */
    async onApplicationBootstrap() {
        await this.importDefaultPermissionList()
    }

    async findAllPermissions() {
        return await this.permissionRepository.find({
            select: ['id', 'uuid', 'name', 'permission', 'entity']
        })
    }

    /**
     * ASSIGNING PERMISSION TO A ROLE
     *
     * @param   {Role}      role           [role description]
     * @param   {number[]}  permissionUuids  [permissionUuids description]
     *
     * @return  {[]}                       [return description]
     */
    async assignPermission(role: Role, permissionUuids: string[]) {
        try {
            role.permissions = []
            if (permissionUuids.length) {
                for (let i = 0; i < permissionUuids.length; i++) {
                    const permission = await this.permissionRepository.findOne({
                        where: {
                            uuid: permissionUuids[i]
                        }
                    })
                    if (!role || !permission) {
                        // 'Role permission not found'
                        return
                    }

                    role.permissions.push(permission)
                }
            }
            return role
        } catch (error) {
            throw new HttpException(
                'Something went wrong while adding permission',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * IMPORTING PERMISSIONS FOR THE FIRST TIME
     *
     * @return  {[type]}  [return description]
     */
    async importDefaultPermissionList() {
        const permissionSet = PermissionSet

        for (const key in permissionSet) {
            for (const subKey in permissionSet[key]) {
                const permissionObj = new Permission()
                for (const innerKey in permissionSet[key][subKey]) {
                    if (innerKey === 'NAME') {
                        permissionObj.name =
                            permissionSet[key][subKey][innerKey]
                    } else if (innerKey === 'PERMISSION') {
                        permissionObj.permission =
                            permissionSet[key][subKey][innerKey]
                    }
                }
                permissionObj.entity = key
                try {
                    await this.permissionRepository.save(permissionObj)
                } catch (error) {
                    // duplicate value cant be inserted
                }
            }
        }
    }

    /**
     * IMPORTING PERMISSIONS FOR THE FIRST TIME
     *
     * @return  {[type]}  [return description]
     */
    async assignPermissionSetToRole(role: Role) {
        role.permissions = []

        const roleSlugToPermissionSet = {
            superadmin: [],
            admin: [],
            user: UserPermissionSet
        }

        const permissionSet =
            roleSlugToPermissionSet[
                slugify(role.name, {
                    replacement: '-', // replace spaces with replacement character, defaults to `-`
                    remove: undefined, // remove characters that match regex, defaults to `undefined`
                    lower: true, // convert to lower case, defaults to `false`
                    strict: false, // strip special characters except replacement, defaults to `false`
                    locale: 'vi', // language code of the locale to use
                    trim: true // trim leading and trailing replacement chars, defaults to `true`
                })
            ]

        // PERMISSION LIST FOR GENERIC USER
        for (const key in permissionSet) {
            if (typeof permissionSet[key] === 'string') {
                const permissionData = await this.permissionRepository.findOne({
                    where: {
                        permission: permissionSet[key]
                    }
                })
                if (permissionData) {
                    role.permissions.push(permissionData)
                }
            } else if (typeof permissionSet[key] === 'object') {
                for (const subKey in permissionSet[key]) {
                    for (const innerKey in permissionSet[key][subKey]) {
                        if (innerKey === 'PERMISSION') {
                            const permissionData =
                                await this.permissionRepository.findOne({
                                    where: {
                                        permission:
                                            permissionSet[key][subKey][innerKey]
                                    }
                                })
                            if (permissionData) {
                                role.permissions.push(permissionData)
                            }
                        }
                    }
                }
            }
        }

        return role
    }
}
