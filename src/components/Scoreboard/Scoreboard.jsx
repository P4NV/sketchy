const MOCK_PLAYERS = [
  { name: 'You', score: 120, color: '#e94560', isYou: true },
  { name: 'Alice', score: 95, color: '#4488ff' },
  { name: 'Bob', score: 72, color: '#44ff44' },
  { name: 'Charlie', score: 48, color: '#ffdd44' },
]

export default function Scoreboard({ players = MOCK_PLAYERS }) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider px-4 pt-4 pb-2 border-b border-white/10">
        Scoreboard
      </h2>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {sorted.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              p.isYou ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
            }`}
          >
            <span className="w-5 text-center text-xs text-gray-500 font-mono">{i + 1}</span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: p.color }}
            >
              {p.name.charAt(0)}
            </div>
            <span className="flex-1 text-sm text-white/80 truncate">{p.name}</span>
            <span className="text-sm font-mono text-white/90">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
