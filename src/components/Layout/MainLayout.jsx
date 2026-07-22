import Canvas from '../Features/Canvas.jsx'
import ActivePlayer from '../Players/ActivePlayer.jsx'
import Scoreboard from '../Scoreboard/Scoreboard.jsx'

export default function MainLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0f23] overflow-hidden">
      {/* Top bar: keyword display */}
      <header className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1a1a2e] border-b border-white/10 shrink-0">
        <span className="text-gray-400 text-sm uppercase tracking-wider">Draw:</span>
        <span className="text-white text-xl font-bold tracking-wide">Castle</span>
        <span className="px-3 py-1 rounded-full bg-[#e94560]/20 text-[#e94560] text-xs font-semibold">
          45s
        </span>
      </header>

      {/* Main content: left sidebar | canvas | right sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — active player */}
        <aside className="w-44 shrink-0 bg-[#1a1a2e] border-r border-white/10 flex flex-col">
          <div className="border-b border-white/10 px-4 py-3">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Drawing</h3>
          </div>
          <ActivePlayer />
        </aside>

        {/* Center — canvas */}
        <main className="flex-1 min-w-0">
          <Canvas />
        </main>

        {/* Right sidebar — scoreboard */}
        <aside className="w-56 shrink-0 bg-[#1a1a2e] border-l border-white/10 flex flex-col">
          <Scoreboard />
        </aside>
      </div>
    </div>
  )
}
