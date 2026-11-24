// Line icons for the six service categories (Lucide-style, 24x24).
const paths: Record<string, string[]> = {
  plumbing: ['M12 2.7c-2.6 3.3-6 6.9-6 10.3a6 6 0 0 0 12 0c0-3.4-3.4-7-6-10.3z'],
  electrical: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
  cleaning: [
    'M9.9 4.1 12 2l2.1 2.1',
    'M12 2v8',
    'm5 13 1.5-3h11l1.5 3',
    'M5 13h14l-1.5 9h-11z',
  ],
  painting: ['M18.4 2.6a2 2 0 0 1 3 3L12 15l-4 1 1-4z', 'M7 17c-1.5 0-3 1-3 3 0 1 .5 2 2 2 2.5 0 4-2 4-4'],
  gardening: ['M7 20h10', 'M12 20V10', 'M12 10C12 6 9 3 5 3c0 4 3 7 7 7z', 'M12 13c0-3 2.5-5.5 6-5.5 0 3.5-2.5 5.5-6 5.5z'],
  handyman: [
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z',
  ],
}

type CategoryIconProps = {
  slug: string
  className?: string
}

export default function CategoryIcon({ slug, className = 'h-6 w-6' }: CategoryIconProps) {
  const icon = paths[slug] ?? paths.handyman
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
