export function getYear(release_date: string): number {
  return parseInt(release_date.split('-')[0])
}

export function getPosterPath(poster_path: string) {
  return 'https://image.tmdb.org/t/p/w500' + poster_path
}
