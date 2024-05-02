import { ValueTransformer } from 'typeorm'

export class NumberTransformer implements ValueTransformer {
    to(value: number): number {
        return value
    }

    from(value: number): number {
        return Number(value)
    }
}
