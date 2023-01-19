import { Controller } from '@nestjs/common'
import { UserService } from 'src/modules/users/users.service'

@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {}
}
