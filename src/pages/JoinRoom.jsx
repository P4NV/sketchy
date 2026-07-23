import { useState } from 'react'
import { joinRoom } from '../lib/gameService'

export default function JoinRoom({ onNavigate, onRoomJoined }) {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Validates the room exists, then navigates to lobby (Lobby manages its own channel)
  async function handleJoin() {
    if (!roomCode.trim()) { setError('Enter a room code'); return }
    if (!playerName.trim()) { setError('Enter your name'); return }

    setLoading(true)
    setError('')

    try {
      const { room, playerId } = await joinRoom(roomCode.trim(), playerName.trim())

      // Lobby will create the channel from room.code + playerId
      onRoomJoined({ room, playerId, playerName: playerName.trim(), isHost: false })
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
        <h1 className="text-4xl text-white font-bold">Join Room</h1>

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <input
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 text-lg uppercase tracking-widest text-center outline-none"
          placeholder="ROOM CODE"
          maxLength={6}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        />

        <input
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 text-lg outline-none"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button onClick={handleJoin} disabled={loading}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg cursor-pointer transition-all disabled:opacity-50">
          {loading ? 'Joining...' : 'Join'}
        </button>

        <button onClick={() => onNavigate('menu')}
          className="text-white/70 hover:text-white text-sm cursor-pointer transition-all">
          Back
        </button>
      </div>
    </div>
  )
}
