import * as mongoose from 'mongoose'

const searchResultsSchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    results: { type: Array, required: true },
    time: { type: Date, required: true },
    type: { type: String, required: true }
  },
  {
    methods: {}
  }
)

export type SearchResults = mongoose.InferSchemaType<typeof searchResultsSchema>
export const SearchResults = mongoose.model('SearchResults', searchResultsSchema)