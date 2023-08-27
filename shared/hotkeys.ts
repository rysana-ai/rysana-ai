/** Parse a string of chords into a list of key lists. */
export function parseChords(value: string) {
  return (
    value
      // Remove whitespace around plus signs.
      .replaceAll(/\s*\+\s*/g, '+')
      // Replace " then " with single spaces.
      .replaceAll(/\s+then\s+/g, ' ')
      // Reduce multiple spaces to single spaces.
      .replaceAll(/\s+/g, ' ')
      // Split on spaces.
      .split(' ')
      // Split on plus signs, and lowercase each key.
      .map(chord => chord.split('+').map(key => key.toLowerCase()))
  )
}
