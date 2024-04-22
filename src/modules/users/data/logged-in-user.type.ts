export type LoggedInUser = {
    id: number
    uuid: string
    firstName: string
    lastName: string
    email: string
    userType: string
    isEmailVerified: boolean
    role: {
        id: number
    }
}
