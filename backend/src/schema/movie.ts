import * as mongoose from 'mongoose'

const movieSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    ext_id: {type: String, required: true}
  },
  {
    methods: {
    }
  }
)

export type Movie = mongoose.InferSchemaType<typeof movieSchema>
export const Movie = mongoose.model('Movie', movieSchema)