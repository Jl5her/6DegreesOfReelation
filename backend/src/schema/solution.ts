import * as mongoose from 'mongoose'

const solutionSchema = new mongoose.Schema(
  {
    id: {type: String, required: true},
    steps: {type: Array, required: true}
  }
)

export type Solution = mongoose.InferSchemaType<typeof solutionSchema>

export const Solution = mongoose.model('Solution', solutionSchema)