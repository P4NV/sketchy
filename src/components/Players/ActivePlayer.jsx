export default function ActivePlayer({ player = { name: 'Player 1', avatar: '', color: '#e94560' } }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ring-2 ring-white/30"
        style={{ backgroundColor: player.color }}
      >
        {player.avatar || player.name.charAt(0).toUpperCase()}
      </div>
      <span className="text-white font-semibold text-lg">{player.name}</span>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Drawing
      </div>
    </div>
  )
}
