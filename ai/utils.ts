export const env = (variable: string): string | undefined => {
  if (typeof process !== 'undefined') {
    return process.env?.[variable] ?? undefined
  }
  return undefined
}
