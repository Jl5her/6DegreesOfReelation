declare module 'reelation' {
  export type Game = { start: Movie, end: Movie, id: string }
  export type Solution = { id: string, steps: { cast: Cast | undefined, movie: Movie }[] }
  export type Result = { correct: boolean, cast: Cast[] }
}
