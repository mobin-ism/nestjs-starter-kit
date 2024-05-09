export type LoggedInUser = {
    id: number
    uuid: string
    username: string
    name: string
    email: string
    userType: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    role: {
        id: number
    }
}
