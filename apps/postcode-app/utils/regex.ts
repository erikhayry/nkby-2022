export function removeEmptySpace (string: string): string {
  return string.replace(/(\r\n|\n|\r|\t)/gm, '').trim()
}
