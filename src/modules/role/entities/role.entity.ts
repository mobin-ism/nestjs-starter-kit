import slugify from 'slugify'
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Permission } from 'src/modules/role/entities/permission.entity'
import { User } from 'src/modules/users/entities/user.entity'
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm'

@Entity()
export class Role extends CustomBaseEntity {
    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    slug: string

    @Column({ type: 'bool', default: false, nullable: false })
    isDefault: boolean

    @Column({ type: 'bigint', nullable: true })
    createdByUserId: number

    @ManyToOne(() => User, (user) => user.roles, {
        onDelete: 'CASCADE'
    })
    createdByUser: User

    @ManyToMany(() => Permission)
    @JoinTable({ name: 'role_permissions' })
    permissions: Permission[]

    @OneToMany(() => User, (user) => user.role)
    users: User[]

    // Define a BeforeInsert and BeforeUpdate hook to slugify the name and set it to slug
    @BeforeInsert()
    @BeforeUpdate()
    setSlug() {
        this.slug = slugify(this.name, {
            replacement: '-', // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            strict: false, // strip special characters except replacement, defaults to `false`
            locale: 'vi', // language code of the locale to use
            trim: true // trim leading and trailing replacement chars, defaults to `true`
        })
    }
    /**
     * CONSTRUCTOR
     */
    constructor(
        name: string,
        isDefault: boolean = false,
        createdByUserId?: number
    ) {
        super()
        this.name = name
        this.isDefault = isDefault
        this.createdByUserId = createdByUserId
    }
}
