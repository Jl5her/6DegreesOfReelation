export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())]
}