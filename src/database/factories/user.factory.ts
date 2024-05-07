// import * as bcrypt from 'bcryptjs'
// import { User } from 'src/modules/users/entities/user.entity'
// import { define } from 'typeorm-seeding'
// define(User, () => {
//     const salt = bcrypt.genSaltSync(10)
//     const hashedPassword = bcrypt.hash('123456', salt)

//     const user = new User(
//         'superadmin',
//         'Super Admin',
//         'superadmin@anchorblock.vc',
//         hashedPassword
//     )
//     user.isEmailVerified = true
//     user.isPhoneVerified = true
//     return user
// })

// src/db/factories/user.factory.ts
import { User } from 'src/modules/users/entities/user.entity'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(User, (faker) => {
    const user = new User(
        faker.internet.userName(),
        faker.person.fullName(),
        faker.internet.email(),
        faker.internet.password()
    )

    return user
})
