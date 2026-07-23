import { useState, useEffect, useCallback, useRef } from 'react'
import { createRoomChannel, subscribeToRoom, broadcastGameStart } from '../lib/realtimeChannel'

// Waiting room — creates its own Realtime channel and manages its lifecycle
export default function Lobby({ room, playerId, playerName, isHost, onNavigate }) {
  const [players, setPlayers] = useState([])
  const [copied, setCopied] = useState(false)
  const channelRef = useRef(null)

  // Create + subscribe to the Realtime channel on mount
  // Creates a fresh channel each time so StrictMode double-effects don't collide
  useEffect(() => {
    const channel = createRoomChannel(room.code, playerId)
    channelRef.current = channel

    subscribeToRoom(channel, playerName, isHost, {
      onPresence: (list) => setPlayers(list),
      onGameStart: () => onNavigate('game'),
    })

    return () => {
      channel.unsubscribe()
      channelRef.current = null
    }
  }, [room.code, playerId, playerName, isHost, onNavigate])

  // Host-only — broadcasts game-start to all players
  const handleStart = useCallback(() => {
    if (!channelRef.current) return
    broadcastGameStart(channelRef.current, {
      roundTime: room.round_time,
      maxRounds: room.max_rounds,
      maxPlayers: room.max_players,
    })
    onNavigate('game')
  }, [room, onNavigate])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLeave = useCallback(() => {
    channelRef.current?.unsubscribe()
    channelRef.current = null
    onNavigate('menu')
  }, [onNavigate])

  return (
    <div className="h-svh w-svw flex bg-blue-600/70 justify-center items-center">
      <div className="flex flex-col items-center shadow-[0px_5px_25px_rgba(0,0,0,0.6)] rounded-3xl gap-6 px-10 py-10 max-w-[420px] w-full">
        <h1 className="text-4xl text-white font-bold">Lobby</h1>

        <div className="flex items-center gap-3 bg-white/20 rounded-xl px-5 py-3">
          <span className="text-3xl font-bold text-white tracking-[0.2em]">{room.code}</span>
          <button onClick={handleCopyCode}
            className="text-white/70 hover:text-white text-sm cursor-pointer transition-all">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p className="text-white/60 text-sm">Share this code for others to join</p>

        <div className="w-full space-y-2">
          <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
            Players ({players.length}/{room.max_players})
          </h2>
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {players.map((p) => (
              <div key={p.id}
                className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2">
                <span className="text-white font-medium">
                  {p.name} {p.isHost && '(Host)'}
                </span>
                {p.id === playerId && (
                  <span className="text-white/50 text-xs">You</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-xl px-4 py-3 space-y-1">
          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Settings</h3>
          <div className="flex justify-between text-white text-sm">
            <span>Round time</span>
            <span className="font-semibold">{room.round_time}s</span>
          </div>
          <div className="flex justify-between text-white text-sm">
            <span>Rounds</span>
            <span className="font-semibold">{room.max_rounds}</span>
          </div>
          <div className="flex justify-between text-white text-sm">
            <span>Max players</span>
            <span className="font-semibold">{room.max_players}</span>
          </div>
        </div>

        {isHost ? (
          <button onClick={handleStart}
            disabled={players.length < 2}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {players.length < 2 ? 'Waiting for players...' : 'Start Game'}
          </button>
        ) : (
          <p className="text-white/60 text-sm">Waiting for host to start...</p>
        )}

        <button onClick={handleLeave}
          className="text-white/50 hover:text-white text-sm cursor-pointer transition-all">
          Leave Room
        </button>
      </div>
    </div>
  )
}
