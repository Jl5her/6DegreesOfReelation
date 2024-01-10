import * as mongoose from 'mongoose'

const gameSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    start: { type: Object, required: true },
    end: { type: Object, required: true }
  },
  {
    methods: {}
  }
)

export type Game = mongoose.InferSchemaType<typeof gameSchema>

export const Game = mongoose.model('Game', gameSchema)