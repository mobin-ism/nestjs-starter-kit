import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission } from '../role/entities/permission.entity'
import { PermissionService } from './services/permission.service'

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    controllers: [],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}
