import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class LoginLog extends CustomBaseEntity {
    @Column({
        type: 'int',
        nullable: false
    })
    userId: number

    @ManyToOne(() => User, (user) => user.loginLog, {
        onDelete: 'CASCADE'
    })
    user: User

    @Column({ type: 'varchar', length: 30, nullable: true })
    ip: string

    @Column()
    time: Date
}
