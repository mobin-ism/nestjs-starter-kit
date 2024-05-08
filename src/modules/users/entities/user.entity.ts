import { Exclude } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { NumberTransformer } from 'src/config/custom-transformer.config'
import { LoginLog } from 'src/modules/auth/entities/login-log.entity'
import { Role } from 'src/modules/role/entities/role.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
@Entity()
export class User extends CustomBaseEntity {
    @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
    username: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false
    })
    @IsEmail()
    email: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    password: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    avatarUrl: string

    @ManyToOne(() => Role, (role) => role.users)
    role: Role

    @Column({ type: 'bigint', nullable: true })
    roleId: number

    @OneToMany(() => Role, (role) => role.createdByUser, {
        cascade: true
    })
    roles: Role[]

    @OneToMany(() => LoginLog, (loginLog) => loginLog.user, {
        cascade: true
    })
    loginLog: LoginLog[]

    @Column({ type: 'bool', nullable: false, default: false })
    isEmailVerified: boolean

    @Column({ type: 'bool', nullable: false, default: false })
    isPhoneVerified: boolean

    @Column({ type: 'varchar', length: 10, nullable: true })
    code: string

    @Column({
        type: 'numeric',
        nullable: true,
        transformer: new NumberTransformer()
    })
    codeExpiredAt: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    hash: string
}
