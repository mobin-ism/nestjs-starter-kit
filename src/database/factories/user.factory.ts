import { User } from 'src/modules/users/entities/user.entity'
import { define } from 'typeorm-seeding'
define(User, () => {
    return new User()
})
