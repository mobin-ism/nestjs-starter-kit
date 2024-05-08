import { Question } from 'src/modules/questions/entities/question.entity'
import { define } from 'typeorm-seeding'
define(Question, () => {
    return new Question()
})
