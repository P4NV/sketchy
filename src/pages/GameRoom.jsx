import { useEffect, useRef } from 'react'
import { createRoomChannel, subscribeToRoom } from '../lib/realtimeChannel'
import Canvas from '../components/Features/Canvas'

// Main game screen — creates its own Realtime channel for game events
// Wraps the Canvas component with a room info header
export default function GameRoom({ room, playerId, playerName, isHost, onNavigate }) {
  const channelRef = useRef(null)

  // Create + subscribe to the Realtime channel for game events
  useEffect(() => {
    const channel = createRoomChannel(room.code, playerId)
    channelRef.current = channel

    subscribeToRoom(channel, playerName, isHost, {
      onGameMove: (payload) => {
        // TODO: handle incoming drawing strokes from other players
      },
      onGameStart: () => {
        // Already in the game — could sync round state here
      },
      onChatMessage: (payload) => {
        // TODO: handle chat messages
      },
    })

    return () => {
      channel.unsubscribe()
      channelRef.current = null
    }
  }, [room.code, playerId, playerName, isHost])

  return (
    <div className="h-svh w-svw flex flex-col bg-[#1a1a2e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#16213e] border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-lg">Room: {room.code}</span>
          <span className="text-white/50 text-sm">
            Round {room.round_time}s | {room.max_rounds} rounds
          </span>
        </div>
        <button onClick={() => onNavigate('menu')}
          className="text-white/50 hover:text-white text-sm cursor-pointer transition-all">
          Leave
        </button>
      </div>
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  )
}
