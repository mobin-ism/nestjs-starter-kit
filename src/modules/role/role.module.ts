import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionService } from '../permission/services/permission.service'
import { RoleController } from './controllers/role.controller'
import { Permission } from './entities/permission.entity'
import { Role } from './entities/role.entity'
import { RoleService } from './services/role.service'

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission])],
    controllers: [RoleController],
    providers: [RoleService, PermissionService],
    exports: [RoleService]
})
export class RoleModule {}
