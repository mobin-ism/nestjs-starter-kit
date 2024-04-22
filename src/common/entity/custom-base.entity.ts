import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Generated,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

export class CustomBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Index({ unique: true })
    @Column({ unique: true })
    @Generated('uuid')
    uuid: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
