/** Transform the entries of a record with a mapping. */
export function mapEntries<T, U>(
  obj: Record<string, T>,
  map: (entry: [string, T]) => [string, U],
) {
  return Object.fromEntries(Object.entries(obj).map(map))
}
