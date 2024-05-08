import * as fs from 'fs'
import * as readline from 'readline'
import { Question } from 'src/modules/questions/entities/question.entity'
import { DataSource } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'

export class QuestionSeed implements Seeder {
    public async run(factory: Factory, dataSource: DataSource) {
        // FIRST TRUNCATE THE QUESTION TABLE
        dataSource.getRepository(Question).delete({})

        const filePath = 'src/modules/questions/data/questions.txt'
        const fileStream = fs.createReadStream(filePath)
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })

        for await (const line of rl) {
            const question = await factory(Question)().make({
                title: line
            })
            await factory(Question)().create(question)
        }

        rl.close()
    }
}
