import { useState, useCallback } from 'react'
import StartMenu from './components/Layout/StartMenu.jsx'
import CreateRoom from './pages/CreateRoom.jsx'
import JoinRoom from './pages/JoinRoom.jsx'
import Lobby from './pages/Lobby.jsx'
import GameRoom from './pages/GameRoom.jsx'

// Simple state-based router — each page manages its own Realtime channel lifecycle
export default function App() {
  const [page, setPage] = useState('menu')
  const [roomState, setRoomState] = useState(null)

  const handleNavigate = useCallback((target) => {
    // Going back to menu discards the room state
    // Each page cleans up its own channel via useEffect
    if (target === 'menu') {
      setRoomState(null)
    }
    setPage(target)
  }, [])

  const handleRoomCreated = useCallback((data) => {
    setRoomState(data)
  }, [])

  const handleRoomJoined = useCallback((data) => {
    setRoomState(data)
  }, [])

  if (page === 'create') {
    return <CreateRoom onNavigate={handleNavigate} onRoomCreated={handleRoomCreated} />
  }

  if (page === 'join') {
    return <JoinRoom onNavigate={handleNavigate} onRoomJoined={handleRoomJoined} />
  }

  if (page === 'lobby' && roomState) {
    return (
      <Lobby
        room={roomState.room}
        playerId={roomState.playerId}
        playerName={roomState.playerName}
        isHost={roomState.isHost}
        onNavigate={handleNavigate}
      />
    )
  }

  if (page === 'game' && roomState) {
    return (
      <GameRoom
        room={roomState.room}
        playerId={roomState.playerId}
        playerName={roomState.playerName}
        isHost={roomState.isHost}
        onNavigate={handleNavigate}
      />
    )
  }

  return <StartMenu onNavigate={handleNavigate} />
}
