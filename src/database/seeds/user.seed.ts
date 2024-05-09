import * as bcrypt from 'bcryptjs'
import { Role } from 'src/modules/role/entities/role.entity'
import { UserTypes } from 'src/modules/users/data/user-type.enum'
import { User } from 'src/modules/users/entities/user.entity'
import { DataSource } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'

export class UserSeed implements Seeder {
    public async run(factory: Factory, dataSource: DataSource) {
        const userRepository = dataSource.getRepository(User)
        const roleRepository = dataSource.getRepository(Role)
        const superadminRole = await roleRepository.findOne({
            where: {
                slug: 'superadmin'
            }
        })

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash('123456', salt)

        if (superadminRole) {
            // FIRST TRUNCATE THE USER TABLE
            await userRepository.delete({})

            // Create a user with the roleId set to the superadmin role's ID
            const user = await factory(User)().make({
                username: 'superadmin',
                name: 'Super Admin',
                email: 'superadmin@anchorblock.vc',
                password: hashedPassword,
                roleId: superadminRole.id,
                isEmailVerified: true,
                isPhoneVerified: true,
                userType: UserTypes.SUPERADMIN
            })

            await factory(User)().create(user)
        }
    }
}
