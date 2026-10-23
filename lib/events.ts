export function isPastEvent(startDateTime: string): boolean {
  return new Date(startDateTime).getTime() < Date.now()
}
