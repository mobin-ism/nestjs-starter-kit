import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger'
import { AllowedUserTypes } from 'src/common/decorators/allowed-user-types.decorator'
import { RequiredVerifications } from 'src/common/decorators/verifications.decorator'
import { AccessControlGuard } from 'src/common/guards/access-control.guard'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { VerifiedUserGuard } from 'src/common/guards/verified-user.guard'
import { RequiredVerificationsEnum } from 'src/modules/auth/data/required-verifications.enum'
import { UserTypes } from 'src/modules/users/data/user-type.enum'
import { CreateRoleDto } from '../dto/create-role.dto'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { RoleService } from '../services/role.service'

@ApiTags('🔒 Role API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerifiedUserGuard, AccessControlGuard)
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a role'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Role created',
        status: HttpStatus.CREATED
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Role has been created',
            result: await this.roleService.create(createRoleDto, request.user)
        }
    }

    @Get('all')
    @ApiOperation({
        summary: 'Get all the roles with list of permissions'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Created successfully',
        status: HttpStatus.CREATED
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async findAll(@Request() request) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Data found',
            result: await this.roleService.findAll(request.user)
        }
    }

    @Get('permissions')
    @ApiOperation({
        summary: 'Get the list of permissions'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Data found',
        status: HttpStatus.OK
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async findAllPermissions() {
        return {
            statusCode: HttpStatus.OK,
            message: 'Data found',
            result: await this.roleService.findAllPermissions()
        }
    }

    @Get(':uuid')
    @ApiOperation({
        summary: 'Get a single role'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Data found',
        status: HttpStatus.OK
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async findOne(@Param('uuid') roleUuid: string, @Request() request) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Data found',
            result: await this.roleService.findOneByUuid(roleUuid, request.user)
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Paginated role response'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Data found',
        status: HttpStatus.OK
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: String,
        description: process.env.DEFAULT_PAGE_SIZE
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async paginate(
        @Request() request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit') limit: number,
        @Query('search', new DefaultValuePipe('')) search = '',
        @Query('orderBy', new DefaultValuePipe('createdAt'))
        orderBy = 'createdAt',
        @Query('desc', new DefaultValuePipe(true), ParseBoolPipe)
        desc = true
    ) {
        limit = limit
            ? limit > parseInt(process.env.DEFAULT_PAGE_SIZE)
                ? parseInt(process.env.DEFAULT_PAGE_SIZE)
                : limit
            : parseInt(process.env.DEFAULT_PAGE_SIZE)

        const result = await this.roleService.paginate(
            request.user,
            {
                page,
                limit,
                route: process.env.APP_URL + '/secure/role'
            },
            search,
            orderBy,
            desc
        )

        return {
            status: HttpStatus.OK,
            message: 'Data found',
            result: result.items,
            meta: result.meta,
            links: result.links
        }
    }

    @Patch(':uuid')
    @ApiOperation({
        summary: 'Update a role'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Role updated',
        status: HttpStatus.OK
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async update(
        @Param('uuid') roleUuid: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @Request() request
    ) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Role has been updated',
            result: await this.roleService.update(
                roleUuid,
                updateRoleDto,
                request.user
            )
        }
    }

    @Delete(':uuid')
    @ApiOperation({
        summary: 'Delete a role'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Role deleted',
        status: HttpStatus.OK
    })
    @RequiredVerifications(RequiredVerificationsEnum.EMAIL)
    @AllowedUserTypes(UserTypes.SUPERADMIN)
    async delete(@Param('uuid') roleUuid: string, @Request() request) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Role has been deleted',
            result: await this.roleService.delete(roleUuid, request.user)
        }
    }
}
