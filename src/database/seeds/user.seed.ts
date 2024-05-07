// import { Role } from 'src/modules/role/entities/role.entity'
// import { User } from 'src/modules/users/entities/user.entity'
// import { DataSource } from 'typeorm'
// import { Factory, Seeder } from 'typeorm-seeding'
// export class UserSeed implements Seeder {
//     public async run(factory: Factory, dataSource: DataSource) {
//         const roleRepository = dataSource.getRepository(Role)
//         const superadminRole = await roleRepository.findOne({
//             where: {
//                 slug: 'superadmin'
//             }
//         })
//         if (superadminRole) {
//             // Create a user with the roleId set to the superadmin role's ID
//             const user = await factory(User)().make({
//                 roleId: superadminRole.id
//             })
//             await factory(User)().create(user)
//         }
//     }
// }

import { User } from 'src/modules/users/entities/user.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const userFactory = factoryManager.get(User)
        // save 1 factory generated entity, to the database
        await userFactory.save()

        // save 5 factory generated entities, to the database
        await userFactory.saveMany(5)
    }
}
