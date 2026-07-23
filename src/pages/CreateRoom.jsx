import { useState } from 'react'
import { createRoom } from '../lib/gameService'

const ROUND_TIME_OPTIONS = [40, 60, 80, 100, 120]
const ROUND_OPTIONS = [1, 2, 3, 4, 5]
const MAX_PLAYERS_OPTIONS = [4, 6, 8, 10, 12]

export default function CreateRoom({ onNavigate, onRoomCreated }) {
  const [hostName, setHostName] = useState('')
  const [roundTime, setRoundTime] = useState(80)
  const [maxRounds, setMaxRounds] = useState(3)
  const [maxPlayers, setMaxPlayers] = useState(8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Creates the room in the DB, then navigates to lobby (Lobby manages its own channel)
  async function handleCreate() {
    if (!hostName.trim()) { setError('Enter your name'); return }

    setLoading(true)
    setError('')

    try {
      const { room, hostPlayerId } = await createRoom({
        hostName: hostName.trim(),
        roundTime,
        maxRounds,
        maxPlayers,
      })

      // Lobby will create the channel from room.code + playerId
      onRoomCreated({ room, playerId: hostPlayerId, playerName: hostName.trim(), isHost: true })
      onNavigate('lobby')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-svh w-svw flex bg-blue-600/70 justify-center items-center">
      <div className="flex flex-col items-center shadow-[0px_5px_25px_rgba(0,0,0,0.6)] rounded-3xl gap-8 px-10 py-10 max-w-[420px]">
        <h1 className="text-4xl text-white font-bold">Create Room</h1>

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <input
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 text-lg outline-none"
          placeholder="Your name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />

        <div className="w-full space-y-4">
          <SettingRow label="Round time">
            <div className="flex gap-2">
              {ROUND_TIME_OPTIONS.map((t) => (
                <button key={t} onClick={() => setRoundTime(t)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer transition-all ${roundTime === t ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  {t}s
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Rounds">
            <div className="flex gap-2">
              {ROUND_OPTIONS.map((r) => (
                <button key={r} onClick={() => setMaxRounds(r)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer transition-all ${maxRounds === r ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  {r}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Max players">
            <div className="flex gap-2">
              {MAX_PLAYERS_OPTIONS.map((m) => (
                <button key={m} onClick={() => setMaxPlayers(m)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer transition-all ${maxPlayers === m ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  {m}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>

        <button onClick={handleCreate} disabled={loading}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg cursor-pointer transition-all disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Room'}
        </button>

        <button onClick={() => onNavigate('menu')}
          className="text-white/70 hover:text-white text-sm cursor-pointer transition-all">
          Back
        </button>
      </div>
    </div>
  )
}

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/80 text-sm font-medium shrink-0">{label}</span>
      {children}
    </div>
  )
}
