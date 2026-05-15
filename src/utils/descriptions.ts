export const description = [
    "create study...",
    "activate study...",
    "generate questions...",
    "study info..."
]

export function getCharBackgroundClass(char: string): string {
  const colorClasses = [
    "bg-red-300",
    "bg-orange-300",
    "bg-amber-300",
    "bg-yellow-300",
    "bg-lime-300",
    "bg-green-300",
    "bg-emerald-300",
    "bg-teal-300",
    "bg-cyan-300",
    "bg-sky-300",
    "bg-blue-300",
    "bg-indigo-300",
    "bg-violet-300",
    "bg-purple-300",
    "bg-fuchsia-300",
    "bg-pink-300",
    "bg-rose-300",
  ];

  if (!char || typeof char !== "string") return "bg-gray-300";

  const upperChar = char.toUpperCase();

  const index = /^[A-Z]$/.test(upperChar)
    ? upperChar.charCodeAt(0) - 65
    : 0;

  const colorIndex = index % colorClasses.length;
  return colorClasses[colorIndex];
}