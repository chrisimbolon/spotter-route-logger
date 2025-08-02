'use client';

export function Legend() {
  const items = [
    { label: "Off Duty", number: 1 },
    { label: "Sleeper", number: 2 },
    { label: "Driving", number: 3 },
    { label: "On Duty (not driving)", number: 4 },
  ]

  return (
    <div className="mt-6 space-y-1 text-sm">
      <h3 className="font-semibold text-lg">Driver’s Daily Log</h3>
      <ul className="pl-2">
        {items.map(({ label, number }) => (
          <li key={number}>
            <strong>{number}</strong> {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
