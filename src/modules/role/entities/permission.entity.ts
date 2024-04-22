import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity, ManyToMany } from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class Permission extends CustomBaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    permission: string

    @Column({ type: 'varchar', length: 255, nullable: false })
    entity: string

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[]
}
