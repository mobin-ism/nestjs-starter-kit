import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity } from 'typeorm'

@Entity('questions')
export class Question extends CustomBaseEntity {
    @Column({ type: 'text', nullable: false })
    title: string

    /**
     *
     * @param title
     */
    constructor(title: string) {
        super()
        this.title = title
    }
}
