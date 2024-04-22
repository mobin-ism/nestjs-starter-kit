import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import {
    IPaginationOptions,
    Pagination,
    paginate
} from 'nestjs-typeorm-paginate'
import slugify from 'slugify'
import { LoggedInUser } from 'src/modules/users/data/logged-in-user.type'
import { EntityManager, FindOptionsOrder, ILike, Repository } from 'typeorm'
import { PermissionService } from '../../permission/services/permission.service'
import { PredefinedUserRoles } from '../data/predefined-roles.enum'
import { CreateRoleDto } from '../dto/create-role.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { Role } from '../entities/role.entity'

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectEntityManager()
        private entityManager: EntityManager,
        private readonly permissionService: PermissionService
    ) {}

    /**
     * IMPORT THE DEFAULT PERMISSIONS
     */
    async onApplicationBootstrap() {
        await this.importDefaultRoles()
    }

    /**
     * CREATING A ROLE
     *
     * @param   {CreateRoleDto}  createRoleDto  [createRoleDto description]
     *
     * @return  {[type]}                        [return description]
     */
    async create(createRoleDto: CreateRoleDto, loggedInUser: LoggedInUser) {
        return await this.entityManager.transaction(async (entityManager) => {
            const roleRepository = entityManager.getRepository(Role)
            const roleObj = new Role(createRoleDto.name, false, loggedInUser.id)

            const insertionData = roleRepository.create(roleObj)
            const createdRole = await roleRepository.save(insertionData)
            const role = await this.permissionService.assignPermission(
                createdRole,
                createRoleDto.permissionUuids
            )

            await roleRepository.save(role)
            return role
        })
    }

    /**
     * UPDATING A ROLE
     *
     * @param   {string}         uuid           [uuid description]
     * @param   {UpdateRoleDto}  updateRoleDto  [updateRoleDto description]
     *
     * @return  {[type]}                        [return description]
     */
    async update(
        uuid: string,
        updateRoleDto: UpdateRoleDto,
        loggedInUser: LoggedInUser
    ) {
        const previousData = await this.roleRepository.findOne({
            where: { uuid: uuid }
        })
        if (!previousData || previousData.createdByUserId != loggedInUser.id) {
            throw new HttpException('Invalid Role', HttpStatus.BAD_REQUEST)
        }

        previousData.name = updateRoleDto.name

        return this.entityManager.transaction(async (entityManager) => {
            const roleRepository = entityManager.getRepository(Role)

            const role = await this.permissionService.assignPermission(
                previousData,
                updateRoleDto.permissionUuids
            )
            await roleRepository.save(role)
            return role
        })
    }

    /**
     * DELETING A ROLE
     *
     * @param   {string}  uuid  [uuid description]
     *
     * @return  {[type]}        [return description]
     */
    async delete(uuid: string, loggedInUser: LoggedInUser) {
        const previousData = await this.roleRepository.findOne({
            where: { uuid: uuid }
        })
        if (!previousData || previousData.createdByUserId != loggedInUser.id) {
            throw new HttpException('Invalid Role', HttpStatus.BAD_REQUEST)
        }

        try {
            return await this.roleRepository.softRemove(previousData)
        } catch (error) {
            throw new HttpException(
                'Error occurred on role deletion',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * FINDING ALL THE ROELS
     *
     * @return  {[type]}  [return description]
     */
    async findAll(loggedInUser: LoggedInUser) {
        return await this.roleRepository.find({
            where: {
                createdByUserId: loggedInUser.id
            },
            relations: ['permissions']
        })
    }

    /**
     * FINDING ALL THE PERMISSIONS
     *
     * @return  {[type]}  [return description]
     */
    async findAllPermissions() {
        return await this.permissionService.findAllPermissions()
    }

    /**
     * FINDING A SPECIFIC ROLE DETAILS
     *
     * @param   {number}  roleId  [roleId description]
     *
     * @return  {[type]}          [return description]
     */
    async findOne(roleId: number) {
        return await this.roleRepository.findOne({
            where: {
                id: roleId
            },
            relations: ['permissions']
        })
    }

    /**
     * FINDING A ROLE BY UUID
     *
     * @param   {string}  uuid  [uuid description]
     *
     * @return  {[type]}        [return description]
     */
    async findOneByUuid(roleUuid: string, loggedInUser: LoggedInUser) {
        return await this.roleRepository.findOne({
            where: {
                uuid: roleUuid,
                createdByUserId: loggedInUser.id
            },
            relations: ['permissions']
        })
    }

    /**
     * PAGINATED RESPONSE FOR USER ROLE
     * @param loggedInUser
     * @param options
     * @param search
     * @param orderBy
     * @param desc
     * @returns
     */
    async paginate(
        loggedInUser: LoggedInUser,
        options: IPaginationOptions,
        search: string,
        orderBy: string,
        desc: boolean
    ): Promise<Pagination<Role>> {
        const orderByQueries = ['name', 'createdAt']
        if (orderByQueries.indexOf(orderBy) === -1) {
            orderBy = 'createdAt'
        }

        const orderByCondition: FindOptionsOrder<Role> = {
            [orderBy]: desc ? 'DESC' : 'ASC'
        }

        return paginate<Role>(this.roleRepository, options, {
            where: {
                name: ILike(`%${search.toLowerCase()}%`),
                createdByUserId: loggedInUser.id
            },
            relations: ['permissions'],
            order: orderByCondition
        })
    }

    /**
     * IMPORTING DEFAULT ROLES
     */
    async importDefaultRoles() {
        const roles = Object.values(PredefinedUserRoles).map((roleName) => ({
            name: roleName,
            isDefault: true
        }))

        roles.map(async (role) => {
            const slug = slugify(role.name, {
                replacement: '-', // replace spaces with replacement character, defaults to `-`
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true, // convert to lower case, defaults to `false`
                strict: false, // strip special characters except replacement, defaults to `false`
                locale: 'vi', // language code of the locale to use
                trim: true // trim leading and trailing replacement chars, defaults to `true`
            })
            const previousData = await this.roleRepository.findOne({
                where: {
                    slug,
                    isDefault: true
                }
            })

            const insertionData =
                await this.permissionService.assignPermissionSetToRole(
                    !previousData ? new Role(role.name, true) : previousData
                )

            await this.roleRepository.save(insertionData)
        })
    }

    /**
     * FINDING A ROLE BY USER TYPE
     */
    async findDefaultUserRoleByUserType(userType: string) {
        return await this.roleRepository.findOne({
            where: {
                slug: slugify(userType, {
                    replacement: '-', // replace spaces with replacement character, defaults to `-`
                    remove: undefined, // remove characters that match regex, defaults to `undefined`
                    lower: true, // convert to lower case, defaults to `false`
                    strict: false, // strip special characters except replacement, defaults to `false`
                    locale: 'vi', // language code of the locale to use
                    trim: true // trim leading and trailing replacement chars, defaults to `true`
                }),
                isDefault: true
            }
        })
    }
}
