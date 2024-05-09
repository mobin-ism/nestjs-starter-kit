import { SetMetadata } from '@nestjs/common'
import { RequiredVerificationsEnum } from 'src/modules/auth/data/required-verifications.enum'

export const REQUIRED_VERIFICATIONS_KEY = 'requiredVerifications'
export const RequiredVerifications = (
    ...requiredVerifications: RequiredVerificationsEnum[]
) => SetMetadata(REQUIRED_VERIFICATIONS_KEY, requiredVerifications)
