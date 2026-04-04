// Deterministic gradient assignment based on sound ID
// Same sound always gets same color — no choice needed at upload time

const GRADIENTS = [
  'from-pink-500 to-purple-600',
  'from-blue-500 to-cyan-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-amber-400',
  'from-red-500 to-pink-500',
  'from-violet-500 to-indigo-500',
  'from-teal-500 to-green-400',
  'from-yellow-500 to-orange-400',
  'from-fuchsia-500 to-pink-400',
  'from-sky-500 to-blue-400',
]

export function getGradient(id: string): string {
  // Sum char codes of the ID string for a stable numeric hash
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return GRADIENTS[hash % GRADIENTS.length]
}
