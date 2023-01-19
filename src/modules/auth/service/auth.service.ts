import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
import { RegisterRequestDto, ValidateRequestDto } from '../dto/auth.dto'
import { JwtService } from './jwt.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(JwtService)
        private readonly jwtService: JwtService
    ) {}

    /**
     * REGISTRATION OF A USER
     */
    public async register({ name, email, password }: RegisterRequestDto) {
        const user = new User()
        user.name = name
        user.email = email
        user.password = this.jwtService.encodePassword(password)
        const registeredUser = await this.userRepository.save(user)
        return {
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
            token: null,
            createdAt: registeredUser.createdAt,
            updatedAt: registeredUser.updatedAt
        }
    }

    /**
     * AUTHENTICATING A USER
     */
    public async login({ email, password }) {
        const user: User = await this.userRepository.findOne({
            where: { email }
        })

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        const isPasswordValid: boolean = this.jwtService.isPasswordValid(
            password,
            user.password
        )

        if (!isPasswordValid) {
            // IF PASSWORD DOES NOT MATCH
            return
        }

        const token: string = this.jwtService.generateToken(user)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    /**
     * VALIDATING A USER
     */
    public async validate({ token }: ValidateRequestDto) {
        const decoded: User = await this.jwtService.verify(token)

        if (!decoded) {
            throw new ForbiddenException('Invalid Access Token')
        }

        const user = await this.jwtService.validateUser(decoded)

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    /**
     * REFRESHING TOKEN FOR AN EXISTING USER
     */
    public refreshToken(loggedInUser: any) {
        return this.jwtService.generateToken(loggedInUser)
    }
}
