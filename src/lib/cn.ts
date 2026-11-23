// Joins class names and skips empty ones: cn('a', isActive && 'b') -> 'a b'
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
