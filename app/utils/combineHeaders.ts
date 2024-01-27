export function combineHeaders(...headers: Array<Headers>) {
  const combined = new Headers();
  for (const header of headers) {
    for (const [key, value] of header.entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}
