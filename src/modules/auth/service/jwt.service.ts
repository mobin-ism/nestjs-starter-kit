import { Injectable } from '@nestjs/common'
import { JwtService as Jwt } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
@Injectable()
export class JwtService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

    private readonly jwt: Jwt

    constructor(jwt: Jwt) {
        this.jwt = jwt
    }

    // Decoding the JWT Token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null)
    }

    // Get User by User ID we get from decode()
    public async validateUser(decoded: any) {
        const user: User = await this.userRepository.findOne({
            where: { id: decoded.id },
            relations: ['role']
        })

        if (!user) {
            // IF USER NOT FOUND
            return
        }

        return {
            id: user.id,
            uuid: user.uuid,
            username: user.username,
            name: user.name,
            email: user.email,
            userType: user.userType,
            authProvider: user.authProvider,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified,
            role: user.role
        }
    }

    // Generate JWT Token
    public generateToken(auth: User): string {
        return this.jwt.sign({ id: auth.id, email: auth.email })
    }

    // Validate User's password
    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword)
    }

    // Encode User's password
    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10)

        return bcrypt.hashSync(password, salt)
    }

    // Validate JWT Token, throw forbidden error if JWT Token is invalid
    public async verify(token: string): Promise<any> {
        try {
            return this.jwt.verify(token)
        } catch (err) {}
    }
}
